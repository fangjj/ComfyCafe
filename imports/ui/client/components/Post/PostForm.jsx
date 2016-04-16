import React from "react";

import "/imports/api/posts/methods";
import media from "/imports/api/media/collection";
import safetyLabels from "/imports/api/common/safetyLabels";
import RainbowSpinner from "/imports/ui/client/components/Spinner/RainbowSpinner";
import Medium from "/imports/ui/client/components/Medium";
import Form from "/imports/ui/client/components/Form";
import VisibilitySelector from "/imports/ui/client/components/VisibilitySelector";
import OriginalitySelector from "/imports/ui/client/components/OriginalitySelector";
import SafetySelector from "/imports/ui/client/components/SafetySelector";
import PretentiousFilterSelector from "/imports/ui/client/components/PretentiousFilterSelector";
import TagField from "/imports/ui/client/components/Tag/TagField";

import {
  TextField,
  Checkbox,
  FlatButton
} from "material-ui";

const defaultState = {
  visibility: "public",
  originality: "original",
  source: "",
  description: "",
  safety: 0,
  autoSafety: 0,
  tags: "tagme",
  condExpanded: {},
  pretentiousFilter: "none"
};

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    if (this.props.post) {
      const post = this.props.post;
      return {
        visibility: post.visibility,
        originality: post.originality,
        source: post.source || defaultState.source,
        description: post.description || defaultState.description,
        safety: post.safety || defaultState.safety,
        autoSafety: post.safety || defaultState.safety,
        tags: post.tags.text || defaultState.tags,
        condExpanded: post.tagsCondExpanded || defaultState.condExpanded,
        pretentiousFilter: post.pretentiousFilter || defaultState.pretentiousFilter
      };
    } else {
      return defaultState;
    }
  },
  getMeteorData() {
    if (this.props.mediumId) {
      const handle = Meteor.subscribe("medium", this.props.mediumId);
      return {
        loading: ! handle.ready(),
        medium: media.findOne({ _id: new Mongo.ObjectID(this.props.mediumId) }),
        currentUser: Meteor.user()
      };
    } else {
      return { loading: false };
    }
  },
  handleVisibility(value) {
    this.setState({visibility: value});
  },
  handleOriginality(value) {
    this.setState({originality: value});
  },
  handleSource(event) {
    this.setState({source: event.target.value});
  },
  handleDescription(event) {
    this.setState({description: event.target.value});
  },
  handleSafety(event, index, value) {
    this.setState({safety: parseInt(value)});
  },
  receiveAutoSafety(value) {
    this.setState({autoSafety: value});
  },
  applyAutoSafety() {
    this.setState({safety: this.state.autoSafety});
  },
  handleTags(value, parsed, condExpanded) {
    this.setState({
      tags: value,
      condExpanded: condExpanded
    });
  },
  handlePretentiousFilter(event, index, value) {
    this.setState({pretentiousFilter: value});
  },
  handleSubmit() {
    const data = {
      visibility: this.state.visibility,
      originality: this.state.originality,
      source: this.state.source,
      description: this.state.description,
      safety: this.state.safety,
      tags: this.state.tags,
      tagsCondExpanded: this.state.condExpanded,
      pretentiousFilter: this.state.pretentiousFilter
    };

    if (! this.props.post) {
      Meteor.call("addPost", this.props.mediumId, data, (err, name) => {
        if (! err) {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }

          const path = FlowRouter.path("post", {
            username: this.data.currentUser.username,
            postName: name
          });
          const actions = {
            redirect() { FlowRouter.go(path); },
            tab() { window.open(path); },
            nothing() {}
          }[this.data.currentUser.settings.uploadAction || "redirect"]();
        } else {
          prettyPrint(err);
        }
      });
    } else {
      Meteor.call("updatePost", this.props.post._id, data, (err) => {
        if (err) {
          prettyPrint(err);
        }
      });
    }
  },
  renderMedium() {
    if (this.data.loading) {
      return <div className="medium center">
        <RainbowSpinner />
      </div>;
    }

    if (this.data.medium) {
      return <div className="medium">
        <Medium medium={this.data.medium} />
      </div>;
    }
  },
  renderSourceField() {
    if (this.props.originality !== "original") {
      return <TextField
        defaultValue={this.props.source}
        floatingLabelText="Source"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={1}
        rowsMax={3}
        onChange={this.handleSource}
        fullWidth={true}
      />;
    }
  },
  render() {
    return <Form
      className="postForm"
      id={this.props.id}
      actions={this.props.actions}
      onSubmit={this.handleSubmit}
      onClose={this.props.onClose}
    >
      {this.renderMedium()}
      <VisibilitySelector
        visibility={this.state.visibility}
        onChange={this.handleVisibility}
      />
      <OriginalitySelector
        value={this.state.originality}
        onChange={this.handleOriginality}
      />
      {this.renderSourceField()}
      <TextField
        defaultValue={this.state.description}
        floatingLabelText="Description"
        floatingLabelStyle={{ fontSize: "20px" }}
        multiLine={true}
        rows={3}
        rowsMax={7}
        onChange={this.handleDescription}
        fullWidth={true}
      />
      <br />
      <SafetySelector
        safety={this.state.safety}
        onChange={this.handleSafety}
      />
      <div className="autoSafety">
        <span className="label">
          Auto Safety: {safetyLabels[this.props.autoSafety]}
        </span>
        <FlatButton
          label="Apply"
          onTouchTap={this.applyAutoSafety}
        />
      </div>
      <TagField
        defaultValue={this.state.tags}
        condExpanded={this.state.condExpanded}
        floatingLabelText="Tags"
        onChange={this.handleTags}
        receiveAutoSafety={this.receiveAutoSafety}
      />
      <PretentiousFilterSelector
        pretentiousFilter={this.props.pretentiousFilter}
        onChange={this.handlePretentiousFilter}
      />
    </Form>;
  }
});

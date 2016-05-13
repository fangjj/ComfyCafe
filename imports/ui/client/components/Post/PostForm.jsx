import React from "react";
import Checkbox from "material-ui/Checkbox";
import FlatButton from "material-ui/FlatButton";

import "/imports/api/posts/methods";
import media from "/imports/api/media/collection";
import safetyLabels from "/imports/api/common/safetyLabels";
import RainbowSpinner from "/imports/ui/client/components/Spinner/RainbowSpinner";
import Medium from "/imports/ui/client/components/Medium";
import Form from "/imports/ui/client/components/Form";
import TextArea from "/imports/ui/client/components/TextArea";
import VisibilitySelector from "/imports/ui/client/components/VisibilitySelector";
import OriginalitySelector from "/imports/ui/client/components/OriginalitySelector";
import SafetySelector from "/imports/ui/client/components/SafetySelector";
import TagField from "/imports/ui/client/components/Tag/TagField";
import BgColorSelector from "/imports/ui/client/components/BgColorSelector";

const defaultState = {
  visibility: "public",
  originality: "original",
  source: "",
  description: "",
  safety: 0,
  autoSafety: 0,
  tags: "tagme",
  condExpanded: {},
  bgColor: "default"
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
        bgColor: post.bgColor || defaultState.bgColor
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
    this.setState({ visibility: value });
  },
  handleOriginality(value) {
    this.setState({ originality: value });
  },
  handleSource(e) {
    this.setState({ source: e.target.value });
  },
  handleDescription(e) {
    this.setState({ description: e.target.value });
  },
  handleSafety(value) {
    this.setState({ safety: parseInt(value) });
  },
  receiveAutoSafety(value) {
    this.setState({ autoSafety: value });
  },
  applyAutoSafety() {
    this.setState({ safety: this.state.autoSafety });
  },
  handleTags(value, parsed, condExpanded) {
    this.setState({
      tags: value,
      condExpanded: condExpanded
    });
  },
  handleBgColor(value) {
    this.setState({ bgColor: value });
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
      bgColor: this.state.bgColor
    };

    if (! this.props.post) {
      Meteor.call("addPost", this.props.mediumId, data, (err, name) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess(this.props.mediumId);
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
      return <TextArea
        defaultValue={this.state.source}
        label="Source"
        rows={1}
        rowsMax={3}
        onChange={this.handleSource}
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
      <OriginalitySelector
        value={this.state.originality}
        onChange={this.handleOriginality}
      />
      <VisibilitySelector
        visibility={this.state.visibility}
        onChange={this.handleVisibility}
      />
      {this.renderSourceField()}
      <TextArea
        defaultValue={this.state.description}
        label="Description"
        rows={3}
        rowsMax={7}
        onChange={this.handleDescription}
      />
      <br />
      <SafetySelector
        safety={this.state.safety}
        onChange={this.handleSafety}
      />
      <div className="autoSafety">
        <span className="label">
          Auto Safety: {safetyLabels[this.state.autoSafety]}
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
      <BgColorSelector
        value={this.state.bgColor}
        onChange={this.handleBgColor}
      />
    </Form>;
  }
});

import React from "react";
import Checkbox from "material-ui/Checkbox";
import FlatButton from "material-ui/FlatButton";

import "/imports/api/posts/methods";
import { initialStateBuilder, dataBuilder } from "/imports/ui/client/utils/forms";
import reasonBuilder from "/imports/ui/client/utils/reasonBuilder";
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
import ReportFormGuts from "/imports/ui/client/components/Report/ReportFormGuts";
import Snackbar from "/imports/ui/client/components/Snackbar";
import DangerButton from "/imports/ui/client/components/Button/DangerButton";

const defaultState = {
  visibility: "public",
  originality: "original",
  source: "",
  description: "",
  safety: 0,
  tags: { text: "tagme" },
  tagsCondExpanded: {},
  bgColor: "default"
};

export default React.createClass({
  mixins: [ReactMeteorData],
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    defaultState.visibility = _.get(this.context.currentUser,
      "settings.defaultImageVisibility", defaultState.visibility
    );
    defaultState.originality = _.get(this.context.currentUser,
      "settings.defaultImageOriginality", defaultState.originality
    );
    const state = initialStateBuilder(this.props.post, defaultState);
    state.autoSafety = 0;
    state.tags = state.tags.text;
    if (! state.bgColor) {
      state.bgColor = defaultState.bgColor;
    }
    if (this.props.mod) {
      state.violation = "spam";
      state.details = "";
    }
    state.snackbarOpen = false;
    return state;
  },
  getMeteorData() {
    if (this.props.mediumId) {
      const handle = Meteor.subscribe("medium", this.props.mediumId);
      return {
        loading: ! handle.ready(),
        medium: media.findOne({ _id: new Mongo.ObjectID(this.props.mediumId) })
      };
    } else {
      return { loading: false };
    }
  },
  handleSnackbarRequestClose() {
    this.setState({ snackbarOpen: false });
  },
  handleViolation(e, index, value) {
    this.setState({ violation: value });
  },
  handleDetails(e) {
    this.setState({ details: e.target.value });
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
  handleTags(tags, parsed, tagsCondExpanded) {
    this.setState({ tags, tagsCondExpanded });
  },
  handleBgColor(value) {
    this.setState({ bgColor: value });
  },
  handleSubmit() {
    const data = dataBuilder(this.state, defaultState);

    if (this.props.mod) {
      const reason = reasonBuilder(this.state);
      Meteor.call("modUpdatePost", this.props.post._id, data, reason, (err) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
          this.setState({ snackbarOpen: true });
        }
      });
    } else if (! this.props.post) {
      Meteor.call("addPost", this.props.mediumId, data, (err, name) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess(this.props.mediumId);
          }

          const path = FlowRouter.path("post", {
            username: this.context.currentUser.username,
            postName: name
          });
          const actions = {
            redirect() { FlowRouter.go(path); },
            tab() { window.open(path); },
            nothing() {}
          }[this.context.currentUser.settings.uploadAction || "redirect"]();
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
  handleModDelete() {
    const reason = reasonBuilder(this.state);
    Meteor.call("modDeletePost", this.props.post._id, reason, (err) => {
      if (err) {
        prettyPrint(err);
      } else {
        FlowRouter.go(FlowRouter.path("adminPanel", { panel: "images" }));
      }
    });
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
  renderReportForm() {
    if (this.props.mod) {
      return <ReportFormGuts
        violation={this.state.violation}
        handleViolation={this.handleViolation}
        details={this.state.details}
        handleDetails={this.handleDetails}
      />;
    }
  },
  render() {
    return <Form
      className="postForm"
      id={this.props.id}
      actions={this.props.actions}
      left={this.props.mod && <DangerButton
        label="Delete"
        iconName="delete"
        subtle={true}
        onTouchTap={this.handleModDelete}
      />}
      onSubmit={this.handleSubmit}
      onClose={this.props.onClose}
    >
      {this.renderReportForm()}

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
      <TextArea
        defaultValue={this.state.description}
        label="Description"
        rows={3}
        rowsMax={7}
        onChange={this.handleDescription}
      />
      <br />
      <SafetySelector
        value={this.state.safety}
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
        condExpanded={this.state.tagsCondExpanded}
        floatingLabelText="Tags"
        onChange={this.handleTags}
        receiveAutoSafety={this.receiveAutoSafety}
      />
      <BgColorSelector
        value={this.state.bgColor}
        onChange={this.handleBgColor}
      />

      <Snackbar
        unexist={! this.props.mod}
        open={this.state.snackbarOpen}
        message="Post updated successfully."
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Form>;
  }
});

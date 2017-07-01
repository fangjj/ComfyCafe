import _ from "lodash";
import React from "react";
import Checkbox from "material-ui/Checkbox";
import FlatButton from "material-ui/FlatButton";

import "/imports/api/posts/methods";
import { initialStateBuilder, dataBuilder } from "/imports/ui/utils/forms";
import reasonBuilder from "/imports/ui/utils/reasonBuilder";
import media from "/imports/api/media/collection";
import safetyLabels from "/imports/api/common/safetyLabels";
import RainbowSpinner from "/imports/ui/components/Spinner/RainbowSpinner";
import Medium from "/imports/ui/components/Medium";
import Form from "/imports/ui/components/Form";
import TextArea from "/imports/ui/components/TextArea";
import VisibilitySelector from "/imports/ui/components/VisibilitySelector";
import OriginalitySelector from "/imports/ui/components/OriginalitySelector";
import SafetySelector from "/imports/ui/components/SafetySelector";
import BgColorSelector from "/imports/ui/components/BgColorSelector";
import ReportFormGuts from "/imports/ui/components/Report/ReportFormGuts";
import Snackbar from "/imports/ui/components/Snackbar";
import DangerButton from "/imports/ui/components/Button/DangerButton";
import Toggle from "/imports/ui/components/Toggle";

const defaultState = {
  published: true,
  originality: "original",
  source: "",
  description: "",
  safety: 0,
  bgColor: "default",
  loop: false
};

export default React.createClass({
  mixins: [ReactMeteorData],
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    defaultState.published = _.get(this.context.currentUser,
      "settings.defaultPublished", defaultState.published
    );
    defaultState.originality = _.get(this.context.currentUser,
      "settings.defaultImageOriginality", defaultState.originality
    );
    const state = initialStateBuilder(this.props.post, defaultState);
    state.autoSafety = 0;
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
  handlePublished(e) {
    this.setState({ published: e.target.checked });
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
  handleBgColor(value) {
    this.setState({ bgColor: value });
  },
  handleLoop(e) {
    this.setState({ loop: e.target.checked });
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
  renderHelp() {
    if (! this.props.mod) {
      return <a className="helpLink" href={FlowRouter.path("help")}>Help</a>;
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
  renderLoop() {
    if (
      _.get(this.props, "post.medium.contentType",
        _.get(this.data, "medium.contentType")
      ).split("/")[0] === "video"
    ) {
      return <div>
        <br />
        <Toggle
          label="Loop video"
          value={this.state.loop}
          onChange={this.handleLoop}
        />
      </div>;
    }
  },
  renderSourceField() {
    if (this.props.originality !== "original") {
      return <TextArea
        defaultValue={this.state.source}
        label="Source"
        rows={1}

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
        onClick={this.handleModDelete}
      />}
      onSubmit={this.handleSubmit}
      onClose={this.props.onClose}
    >
      {this.renderReportForm()}

      {this.renderMedium()}
      {this.renderHelp()}
      <VisibilitySelector
        value={this.state.published}
        onChange={this.handlePublished}
      />
      <OriginalitySelector
        value={this.state.originality}
        onChange={this.handleOriginality}
      />
      {this.renderLoop()}
      {this.renderSourceField()}
      <TextArea
        defaultValue={this.state.description}
        label="Description"
        rows={3}

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
          onClick={this.applyAutoSafety}
        />
      </div>
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

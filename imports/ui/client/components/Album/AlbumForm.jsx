import React from "react";

import "/imports/api/albums/methods";
import { initialStateBuilder, dataBuilder } from "/imports/ui/client/utils/forms";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import TextArea from "/imports/ui/client/components/TextArea";
import VisibilitySelector from "/imports/ui/client/components/VisibilitySelector";
import reasonBuilder from "/imports/ui/client/utils/reasonBuilder";
import ReportFormGuts from "/imports/ui/client/components/Report/ReportFormGuts";
import Snackbar from "/imports/ui/client/components/Snackbar";
import DangerButton from "/imports/ui/client/components/Button/DangerButton";

const defaultState = {
  name: "",
  posts: [],
  visibility: "public",
  description: ""
};

export default React.createClass({
  getInitialState() {
    const state = initialStateBuilder(this.props.album, defaultState);
    if (this.props.mod) {
      state.violation = "spam";
      state.details = "";
    }
    state.snackbarOpen = false;
    return state;
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
  handleName(e) {
    this.setState({ name: e.target.value });
  },
  handlePosts(e) {
    this.setState({ posts: commaSplit(e.target.value) });
  },
  handleVisibility(value) {
    this.setState({ visibility: value });
  },
  handleDescription(e) {
    this.setState({ description: e.target.value });
  },
  redirect(slug) {
    const path = FlowRouter.path("album", {
      username: _.get(this.props, "album.owner.username", this.props.currentUser.username),
      albumSlug: slug
    });
    FlowRouter.go(path);
  },
  handleSubmit() {
    const data = dataBuilder(this.state, defaultState);

    if (this.props.mod) {
      const reason = reasonBuilder(this.state);
      Meteor.call("modUpdateAlbum", this.props.album._id, data, reason, (err) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
          this.setState({ snackbarOpen: true });
        }
      });
    } else if (! this.props.album) {
      Meteor.call("addAlbum", data, (err, slug) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
          this.redirect(slug);
        }
      });
    } else {
      Meteor.call("updateAlbum", this.props.album._id, data, (err, slug) => {
        if (err) {
          prettyPrint(err);
        } else {
          this.redirect(slug);
        }
      });
    }
  },
  handleModDelete() {
    const reason = reasonBuilder(this.state);
    Meteor.call("modDeleteAlbum", this.props.album._id, reason, (err) => {
      if (err) {
        prettyPrint(err);
      } else {
        FlowRouter.go(FlowRouter.path("adminPanel", { panel: "albums" }));
      }
    });
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

      <TextField
        defaultValue={this.state.name}
        label="Name"
        onChange={this.handleName}
      />
      <TextField
        defaultValue={this.state.posts.join(", ")}
        label="Posts"
        onChange={this.handlePosts}
      />
      <VisibilitySelector
        visibility={this.state.visibility}
        onChange={this.handleVisibility}
      />
      <TextArea
        defaultValue={this.state.description}
        label="Description"
        rows={3}
        rowsMax={7}
        onChange={this.handleDescription}
      />

      <Snackbar
        unexist={! this.props.mod}
        open={this.state.snackbarOpen}
        message="Album updated successfully."
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Form>;
  }
});

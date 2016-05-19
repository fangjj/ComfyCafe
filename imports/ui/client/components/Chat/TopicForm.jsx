import React from "react";

import "/imports/api/topics/methods";
import generateTopic from "/imports/api/topics/nameGen/generator";
import { initialStateBuilder, dataBuilder } from "/imports/ui/client/utils/forms";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import reasonBuilder from "/imports/ui/client/utils/reasonBuilder";
import ReportFormGuts from "/imports/ui/client/components/Report/ReportFormGuts";
import Snackbar from "/imports/ui/client/components/Snackbar";
import DangerButton from "/imports/ui/client/components/Button/DangerButton";

const defaultState = {
  name: generateTopic
};

export default React.createClass({
  getInitialState() {
    const state = initialStateBuilder(this.props.topic, defaultState);
    state.nameGenerated = ! this.props.topic;
    if (this.props.mod) {
      state.violation = "spam";
      state.details = "";
    }
    state.snackbarOpen = false;
    return state;
  },
  componentWillReceiveProps() {
    if (this.state.nameGenerated) {
      this.setState({ name: generateTopic() });
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
  handleName(e) {
    this.setState({
      name: e.target.value,
      nameGenerated: false
    });
  },
  handleSubmit(e) {
    const data = dataBuilder(this.state, defaultState);

    if (this.props.mod) {
      const reason = reasonBuilder(this.state);
      Meteor.call("modUpdateTopic", this.props.topic._id, data, reason, (err) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
          this.setState({ snackbarOpen: true });
        }
      });
    } else if (! this.props.topic) {
      Meteor.call("addTopic", this.props.room._id, data, false, (err, topicSlug) => {
        if (err) {
          prettyPrint(err);
        } else {
          const path = FlowRouter.path("topic", {
            roomSlug: this.props.room.slug,
            topicSlug: topicSlug
          });
          FlowRouter.go(path);
        }
      });
    } else {
      Meteor.call("updateTopic", this.props.topic._id, data, (err, topicSlug) => {
        if (err) {
          prettyPrint(err);
        } else {
          const path = FlowRouter.path("topic", {
            roomSlug: this.props.room.slug,
            topicSlug: topicSlug
          });
          FlowRouter.go(path);
        }
      });
    }
  },
  handleModDelete() {
    const reason = reasonBuilder(this.state);
    Meteor.call("modDeleteTopic", this.props.topic._id, reason, (err) => {
      if (err) {
        prettyPrint(err);
      } else {
        FlowRouter.go(FlowRouter.path("adminPanel", { panel: "topics" }));
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

      <Snackbar
        open={this.state.snackbarOpen}
        message="Topic updated successfully."
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Form>;
  }
});

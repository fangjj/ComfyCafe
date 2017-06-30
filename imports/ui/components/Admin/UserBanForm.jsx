import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import { initialStateBuilder, dataBuilder } from "/imports/ui/utils/forms";
import reasonBuilder from "/imports/ui/utils/reasonBuilder";
import Form from "/imports/ui/components/Form";
import TextField from "/imports/ui/components/TextField";
import ReportFormGuts from "/imports/ui/components/Report/ReportFormGuts";
import Actions from "/imports/ui/components/Actions";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import CancelButton from "/imports/ui/components/Button/CancelButton";
import Snackbar from "/imports/ui/components/Snackbar";

const defaultState = {
  ban: ""
};

export default React.createClass({
  getInitialState() {
    const state = initialStateBuilder(this.props.user, defaultState);
    state.violation = "spam";
    state.details = "";
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
  handleDuration(e) {
    this.setState({ ban: e.target.value });
  },
  handleSubmit() {
    const data = dataBuilder(this.state, defaultState);
    const reason = reasonBuilder(this.state);
    if (! this.props.communitySlug) {
      Meteor.call("modBanUser", this.props.user._id, data, reason, (err) => {
        if (err) {
          prettyPrint(err);
        } else {
          this.setState({ snackbarOpen: true, snackbarMsg: "banned" });
        }
      });
    } else {
      Meteor.call("communityModBanUser", this.props.user._id, this.props.communitySlug, data, reason, (err) => {
        if (err) {
          prettyPrint(err);
        } else {
          this.setState({ snackbarOpen: true, snackbarMsg: "banned" });
        }
      });
    }
  },
  handleUnban() {
    if (! this.props.communitySlug) {
      Meteor.call("modUnbanUser", this.props.user._id, (err) => {
        if (err) {
          prettyPrint(err);
        } else {
          this.setState({ snackbarOpen: true, snackbarMsg: "unbanned" });
        }
      });
    } else {
      Meteor.call("communityModUnbanUser", this.props.user._id, this.props.communitySlug, (err) => {
        if (err) {
          prettyPrint(err);
        } else {
          this.setState({ snackbarOpen: true, snackbarMsg: "unbanned" });
        }
      });
    }
  },
  render() {
    const left = <CancelButton
      label="Unban"
      iconName="hourglass_empty"
      onClick={this.handleUnban}
    />;
    return <Form actions={false} left={left} onSubmit={this.handleSubmit}>
      <ReportFormGuts
        violation={this.state.violation}
        handleViolation={this.handleViolation}
        details={this.state.details}
        handleDetails={this.handleDetails}
      />
      <TextField
        id="banDuration"
        label="Duration"
        defaultValue={this.state.ban}
        onChange={this.handleDuration}
      />
      <Actions left={left}>
        <SubmitButton
          type="submit"
          label="Ban"
          iconName="hourglass_full"
        />
      </Actions>

      <Snackbar
        open={this.state.snackbarOpen}
        message={"User " + this.state.snackbarMsg + " successfully."}
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Form>;
  }
});

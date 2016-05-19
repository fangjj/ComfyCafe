import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import { initialStateBuilder, dataBuilder } from "/imports/ui/client/utils/forms";
import reasonBuilder from "/imports/ui/client/utils/reasonBuilder";
import Powerless from "/imports/ui/client/components/Powerless";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import TextArea from "/imports/ui/client/components/TextArea";
import MultiField from "/imports/ui/client/components/MultiField";
import SafetySelector from "/imports/ui/client/components/SafetySelector";
import BirthdaySelector from "/imports/ui/client/components/BirthdaySelector";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import ReportFormGuts from "/imports/ui/client/components/Report/ReportFormGuts";
import Snackbar from "/imports/ui/client/components/Snackbar";
import DangerButton from "/imports/ui/client/components/Button/DangerButton";

const defaultState = {
  displayName: "",
  blurb: "",
  bio: "",
  birthday: { month: 1, day: 1 },
  avatarSafety: 0,
  info: {},
  infoOrder: []
};

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    const state = initialStateBuilder(this.props.user.profile, defaultState);
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
  handleDisplayName(event) {
    this.setState({ displayName: e.target.value });
  },
  handleBlurb(e) {
    this.setState({ blurb: e.target.value });
  },
  handleBio(e) {
    this.setState({ bio: e.target.value });
  },
  handleBirthday(month, day) {
    this.setState({ birthday: { month, day } });
  },
  handleAvararSafety(value) {
    this.setState({ avatarSafety: value });
  },
  handleInfo(info, order) {
    this.setState({
      info: info,
      infoOrder: order
    });
  },
  handleSubmit(e) {
    const data = dataBuilder(this.state, defaultState);
    if (this.props.mod) {
      const reason = reasonBuilder(this.state);
      Meteor.call("modUpdateProfile", this.props.user._id, data, reason, (err) => {
        if (err) {
          prettyPrint(err);
        } else {
          this.setState({ snackbarOpen: true });
        }
      });
    } else {
      Meteor.call("updateProfile", data);
    }
  },
  handleModDeleteAvatar() {
    const reason = reasonBuilder(this.state);
    Meteor.call("modDeleteAvatar", this.props.user._id, reason, (err) => {
      if (err) {
        prettyPrint(err);
      } else {
        this.setState({ snackbarOpen: true });
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
        label="Delete Avatar"
        iconName="delete"
        subtle={true}
        onTouchTap={this.handleModDeleteAvatar}
      />}
      onSubmit={this.handleSubmit}
      onClose={this.props.onClose}
    >
      {this.renderReportForm()}

      <TextField
        defaultValue={this.state.displayName}
        label="Display Name"
        onChange={this.handleDisplayName}
      />

      <TextField
        defaultValue={this.state.blurb}
        label="Sassy Catchphrase"
        onChange={this.handleBlurb}
      />

      <TextArea
        defaultValue={this.state.bio}
        label="Who the hell are you?"
        rows={2}
        rowsMax={5}
        onChange={this.handleBio}
      />

      <BirthdaySelector
        month={this.state.birthday.month}
        day={this.state.birthday.day}
        onChange={this.handleBirthday}
      />

      <SafetySelector
        label="Avatar Safety"
        value={this.state.avatarSafety}
        onChange={this.handleAvararSafety}
      />
      <br />

      <MultiField
        label="Random Information"
        defaultValue={this.state.info}
        defaultOrder={this.state.infoOrder}
        defaultQty={1}
        onChange={this.handleInfo}
      />

      <Snackbar
        open={this.state.snackbarOpen}
        message="User updated successfully."
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Form>;
  }
});

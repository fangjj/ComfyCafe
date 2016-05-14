import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import { initialStateBuilder, dataBuilder } from "/imports/ui/client/utils/forms";
import Powerless from "/imports/ui/client/components/Powerless";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import TextArea from "/imports/ui/client/components/TextArea";
import MultiField from "/imports/ui/client/components/MultiField";
import SafetySelector from "/imports/ui/client/components/SafetySelector";
import BirthdaySelector from "/imports/ui/client/components/BirthdaySelector";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";

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
    return initialStateBuilder(this.context.currentUser.profile, defaultState);
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
    Meteor.call("updateProfile", dataBuilder(this.state, defaultState));
  },
  render() {
    return <Form
      id={this.props.id}
      actions={this.props.actions}
      onSubmit={this.handleSubmit}
      onClose={this.props.onClose}
    >
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
    </Form>;
  }
});

import _ from "lodash";
import React from "react";
import {
  SelectField,
  MenuItem,
  Toggle
} from "material-ui";

import "/imports/api/users/methods";
import Powerless from "/imports/ui/client/components/Powerless";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import MultiField from "/imports/ui/client/components/MultiField";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";

export default React.createClass({
  getInitialState() {
    return {
      displayName: _.get(this.props.currentUser, "profile.displayName", ""),
      blurb: _.get(this.props.currentUser, "profile.blurb", ""),
      info: _.get(this.props.currentUser, "profile.info", {}),
      infoOrder: _.get(this.props.currentUser, "profile.infoOrder", [])
    };
  },
  handleDisplayName(event) {
    this.setState({ displayName: event.target.value });
  },
  handleBlurb(event) {
    this.setState({ blurb: event.target.value });
  },
  handleBirthday(event, date) {
    this.setState({ birthday: date });
  },
  handleInfo(info, order) {
    this.setState({
      info: info,
      infoOrder: order
    });
  },
  handleSubmit(e) {
    Meteor.call("updateProfile", {
      displayName: this.state.displayName,
      blurb: this.state.blurb,
      info: this.state.info,
      infoOrder: this.state.infoOrder
    });
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

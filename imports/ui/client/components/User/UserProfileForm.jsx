import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";

import Powerless from "/imports/ui/client/components/Powerless";
import Actions from "/imports/ui/client/components/Actions";
import MultiField from "/imports/ui/client/components/MultiField";
import CancelButton from "/imports/ui/client/components/Button/CancelButton";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";

import {
  TextField,
  SelectField,
  MenuItem,
  Toggle
} from "material-ui";

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
  handleInfo(info, order) {
    this.setState({
      info: info,
      infoOrder: order
    });
  },
  handleSubmit(e) {
    e.preventDefault();

    Meteor.call("updateProfile", {
      displayName: this.state.displayName,
      blurb: this.state.blurb,
      info: this.state.info,
      infoOrder: this.state.infoOrder
    });

    this.props.onCancel(e);
  },
  handleCancel(e) {
    this.props.onCancel(e);
  },
  render() {
    return <form onSubmit={this.handleSubmit}>
      <TextField
        defaultValue={this.state.displayName}
        floatingLabelText="Display Name"
        floatingLabelStyle={{fontSize: "20px"}}
        fullWidth={true}
        onChange={this.handleDisplayName}
      />

      <TextField
        defaultValue={this.state.blurb}
        floatingLabelText="Sassy Catchphrase"
        floatingLabelStyle={{fontSize: "20px"}}
        fullWidth={true}
        onChange={this.handleBlurb}
      />

      <MultiField
        label="Random Information"
        defaultValue={this.state.info}
        defaultOrder={this.state.infoOrder}
        defaultQty={1}
        onChange={this.handleInfo}
      />

      <Actions>
        <CancelButton
          onTouchTap={this.handleCancel}
        />
        <SubmitButton
          type="submit"
          label="Save"
          onTouchTap={this.handleSubmit}
        />
      </Actions>
    </form>;
  }
});

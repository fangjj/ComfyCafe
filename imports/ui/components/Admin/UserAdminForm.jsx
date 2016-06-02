import _ from "lodash";
import React from "react";

import "/imports/api/users/adminMethods";
import { isAdmin, isDev, isMod } from "/imports/api/common/persimmons";
import List from "/imports/ui/components/List";
import Form from "/imports/ui/components/Form";
import TextField from "/imports/ui/components/TextField";
import RoleField from "/imports/ui/components/RoleField";
import Snackbar from "/imports/ui/components/Snackbar";

export default React.createClass({
  getInitialState() {
    return {
      badges: _.map(_.get(this.props.user, "profile.badges", []), (badge) => {
        return badge.name;
      }).join(", "),
      isAdmin: isAdmin(this.props.user._id),
      isDev: isDev(this.props.user._id),
      isMod: isMod(this.props.user._id),
      snackbarOpen: false
    };
  },
  handleSnackbarRequestClose() {
    this.setState({ snackbarOpen: false });
  },
  handleBadges(e) {
    this.setState({ badges: e.target.value });
  },
  handleAdmin(e) {
    this.setState({ isAdmin: e.target.checked });
  },
  handleDev(e) {
    this.setState({ isDev: e.target.checked });
  },
  handleMod(e) {
    this.setState({ isMod: e.target.checked });
  },
  handleSubmit() {
    const data = _.omit(this.state, [ "snackbarOpen" ]);
    Meteor.call("adminUpdateUser", this.props.user._id, data, (err) => {
      if (err) {
        prettyPrint(err);
      } else {
        this.setState({ snackbarOpen: true });
      }
    });
  },
  render() {
    return <Form actions={true} onSubmit={this.handleSubmit}>
      <TextField
        id="userBadges"
        label="Badges (comma separated)"
        defaultValue={this.state.badges}
        onChange={this.handleBadges}
      />
      <RoleField
        isAdmin={this.state.isAdmin}
        isDev={this.state.isDev}
        isMod={this.state.isMod}
        handleAdmin={this.handleAdmin}
        handleDev={this.handleDev}
        handleMod={this.handleMod}
      />
      <Snackbar
        open={this.state.snackbarOpen}
        message="User updated successfully."
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Form>;
  }
});

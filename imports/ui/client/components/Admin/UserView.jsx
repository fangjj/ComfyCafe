import React from "react";

import "/imports/api/users/adminMethods";
import { isAdmin, isDev, isMod } from "/imports/api/common/persimmons";
import DenseContent from "/imports/ui/client/components/DenseContent";
import List from "/imports/ui/client/components/List";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import RoleField from "/imports/ui/client/components/RoleField";

export default React.createClass({
  getInitialState() {
    return {
      badges: _.map(_.get(this.props.user, "profile.badges", []), (badge) => {
        return badge.name;
      }).join(", "),
      isAdmin: isAdmin(this.props.user._id),
      isDev: isDev(this.props.user._id),
      isMod: isMod(this.props.user._id)
    };
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
    Meteor.call("adminUpdateUser", this.props.user._id, this.state);
  },
  render() {
    return <DenseContent>
      {this.props.user.username
        + " (" + _.get(this.props.user, "profile.displayName", this.props.user.username) + ")"
      }
      <Form actions={true} onSubmit={this.handleSubmit}>
        <TextField
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
      </Form>
    </DenseContent>;
  }
});

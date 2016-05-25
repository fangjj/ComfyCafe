import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import { isAdmin, isMod, isMember } from "/imports/api/common/persimmons";
import List from "/imports/ui/components/List";
import Form from "/imports/ui/components/Form";
import TextField from "/imports/ui/components/TextField";
import RoleField from "/imports/ui/components/RoleField";
import Snackbar from "/imports/ui/components/Snackbar";

export default React.createClass({
  getInitialState() {
    const slug = FlowRouter.getParam("roomSlug");
    const group = "community_" + slug;
    return {
      /*badges: _.map(_.get(this.props.user, "profile.badges", []), (badge) => {
        return badge.name;
      }).join(", "),*/
      badges: "",
      isAdmin: isAdmin(this.props.user._id, group),
      isMod: isMod(this.props.user._id, group),
      isMember: isMember(this.props.user._id, group),
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
  handleMod(e) {
    this.setState({ isMod: e.target.checked });
  },
  handleMember(e) {
    this.setState({ isMember: e.target.checked });
  },
  handleSubmit() {
    const data = _.omit(this.state, [ "snackbarOpen" ]);
    const slug = FlowRouter.getParam("roomSlug");
    Meteor.call("communityUpdateMember", slug, this.props.user._id, data, (err) => {
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
        label="Badges (comma separated)"
        defaultValue={this.state.badges}
        onChange={this.handleBadges}
      />
      <RoleField
        isAdmin={this.state.isAdmin}
        isMod={this.state.isMod}
        isMember={this.state.isMember}
        handleAdmin={this.handleAdmin}
        handleMod={this.handleMod}
        handleMember={this.handleMember}
      />
      <Snackbar
        open={this.state.snackbarOpen}
        message="Member updated successfully."
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Form>;
  }
});

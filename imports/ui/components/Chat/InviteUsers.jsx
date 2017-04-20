import React from "react";

import "/imports/api/rooms/methods";
import UserField from "/imports/ui/components/User/UserField";
import Actions from "/imports/ui/components/Actions";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import Snackbar from "/imports/ui/components/Snackbar";

export default React.createClass({
  getInitialState() {
    return { inviteList: [], snackbarOpen: false };
  },
  handleSnackbarRequestClose() {
    this.setState({ snackbarOpen: false });
  },
  handleUsers(userList) {
    this.setState({ inviteList: commaSplit(userList) });
  },
  sendInvites() {
    Meteor.call("inviteUsers", this.props.community._id, this.state.inviteList, (err) => {
      if (err) {
        prettyPrint(err);
      } else {
        this.setState({ snackbarOpen: true });
      }
    });
  },
  render() {
    return <div>
      <UserField
        id="inviteUser"
        label="Invite users (comma-separated)"
        onChange={this.handleUsers}
      />
      <Actions>
        <SubmitButton
          label="Invite"
          iconName="vpn_key"
          onClick={this.sendInvites}
        />
      </Actions>

      <Snackbar
        open={this.state.snackbarOpen}
        message="Invites sent!"
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </div>;
  }
});

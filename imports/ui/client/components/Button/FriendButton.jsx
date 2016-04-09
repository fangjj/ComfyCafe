import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import Notifications from "/imports/api/notifications/collection";

import ToggleButton from "./ToggleButton";

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("friendRequest", Meteor.userId(), this.props.user._id);
    return {
      loading: ! handle.ready(),
      friendRequest: Notifications.findOne(
        {
          action: "friendRequest",
          to: this.props.user._id,
          "owner._id": Meteor.userId()
        }
      )
    };
  },
  friendRequest(event) {
    Meteor.call("sendFriendRequest", this.props.user._id);
  },
  cancelFriendRequest(event) {
    Meteor.call("cancelFriendRequest", this.data.friendRequest._id);
  },
  unfriend(event) {
    Meteor.call("unfriend", this.props.user._id);
  },
  render() {
    const friended = this.props.currentUser
      && _.includes(this.props.currentUser.friends, this.props.user._id);

    if (! friended) {
      const requested = this.props.currentUser
        && this.data.friendRequest;
      return <ToggleButton
        className="friend-request"
        active={requested}
        activate={this.friendRequest}
        deactivate={this.cancelFriendRequest}
        labelActivate="Friend Request"
        iconActivate="person_add"
        labelActivated="Friend Requested"
        iconActivated="check"
        labelDeactivate="Cancel Request"
        iconDeactivate="undo"
        width={208}
      />;
    } else {
      return <ToggleButton
        className="friended"
        active={true}
        deactivate={this.unfriend}
        dangerous={true}
        labelActivated="Friended"
        iconActivated="sentiment_very_satisfied"
        labelDeactivate="Unfriend"
        iconDeactivate="delete_sweep"
        width={140}
      />;
    }
  }
});

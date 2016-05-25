import _ from "lodash";
import React from "react";

import "/imports/api/rooms/methods";
import { isMember } from "/imports/api/common/persimmons";
import ToggleButton from "./ToggleButton";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  join() {
    Meteor.call("joinCommunity", this.props.room._id, prettyPrint);
  },
  leave() {
    Meteor.call("leaveCommunity", this.props.room._id, prettyPrint);
  },
  render() {
    const joined = this.context.currentUser
      && isMember(this.context.currentUser._id, "community_" + this.props.room.slug);
    return <ToggleButton
      active={joined}
      activate={this.join}
      deactivate={this.leave}
      labelActivate="Join"
      iconActivate="sentiment_satisfied"
      labelActivated="Joined"
      iconActivated="sentiment_very_satisfied"
      labelDeactivate="Leave"
      iconDeactivate="sentiment_very_dissatisfied"
      width={113}
    />;
  }
});

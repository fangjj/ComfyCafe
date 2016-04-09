import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";

import ToggleButton from "./ToggleButton";

export default React.createClass({
  toggleSubscription(event) {
    Meteor.call("toggleSubscription", this.props.owner._id);
  },
  render() {
    const subscribed = this.props.currentUser
      && _.includes(this.props.currentUser.subscriptions, this.props.owner._id);
    return <ToggleButton
      className="subscribe"
      active={subscribed}
      activate={this.toggleSubscription}
      deactivate={this.toggleSubscription}
      labelActivate="Subscribe"
      iconActivate="add_box"
      labelActivated="Subscribed"
      iconActivated="check_box"
      labelDeactivate="Unsubscribe"
      iconDeactivate="indeterminate_check_box"
    />;
  }
});

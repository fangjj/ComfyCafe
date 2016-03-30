import _ from "lodash";
import React from "react";

import ToggleButton from "./ToggleButton";

const WatchButton = React.createClass({
  watch(event) {
    Meteor.call("watchTopic", this.props.topic._id);
  },
  unwatch(event) {
    Meteor.call("unwatchTopic", this.props.topic._id);
  },
  render() {
    const watched = this.props.currentUser
      && _.includes(this.props.topic.watchers, this.props.currentUser._id);
    return <ToggleButton
      active={watched}
      activate={this.watch}
      deactivate={this.unwatch}
      labelActivate="Watch"
      iconActivate="visibility"
      labelActivated="Watched"
      iconActivated="check"
      labelDeactivate="Unwatch"
      iconDeactivate="visibility_off"
      width={141}
    />;
  }
});

export default WatchButton;

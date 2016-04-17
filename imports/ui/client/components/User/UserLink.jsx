import _ from "lodash";
import React from "react";

import BadgeGroup from "/imports/ui/client/components/BadgeGroup";

export default React.createClass({
  getInitialState() {
    return { open: false }
  },
  handleTouchTap(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  },
  handleRequestClose() {
    this.setState({ open: false });
  },
  renderBadges() {
    return <BadgeGroup badges={_.get(this.props.user, "profile.badges", {})} />;
  },
  render() {
    var user = this.props.user;
    var path = FlowRouter.path("profile", {username: user.username});
    return <div className="userLink" style={{display: "inline"}}>
      <a href={path} title={user.profile.blurb}>
        {user.profile.displayName || user.username}
      </a>
    </div>;
  }
});

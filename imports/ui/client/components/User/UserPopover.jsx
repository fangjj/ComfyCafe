import React from "react";
import OnClickOutside from "react-onclickoutside";

import BadgeGroup from "/imports/ui/client/components/BadgeGroup";

export default React.createClass({
  mixins: [OnClickOutside],
  handleClickOutside(e) {
    this.props.onClose();
  },
  renderBadges(user) {
    return <BadgeGroup badges={_.get(user, "profile.badges", {})} />;
  },
  render() {
    const user = this.props.user;
    return <div
      className="userPopover"
      style={{
        display: (this.props.open ? "block" : "none"),
        left: this.props.anchor
      }}
    >
      {user.profile.blurb}
      {this.renderBadges(user)}
    </div>;
  }
});

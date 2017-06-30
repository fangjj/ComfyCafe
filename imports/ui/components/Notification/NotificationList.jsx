import React from "react";
import OnClickOutside from "react-onclickoutside";

import NotificationListItem from "./NotificationListItem";
import HappyBirthday from "./HappyBirthday";

export default React.createClass({
  mixins: [OnClickOutside],
  handleClickOutside(event) {
    if (this.props.visible) {
      this.props.action();
    }
  },
  renderNotifications(isBday) {
    if (this.props.notifications.length) {
      return this.props.notifications.map((notification) => {
        return <NotificationListItem
          notification={notification}
          key={notification._id}
        />;
      });
    }
    if (! isBday) {
      return <li>No notifications.</li>;
    }
  },
  render() {
    let classes = "topMenu";
    if (this.props.visible) {
      classes = "topMenu active";
    }

    const bday = <HappyBirthday />;

    return <div>
      <div id="notificationArrow" className={classes}></div>
      <ol id="notificationList" className={classes}>
        {bday}
        {this.renderNotifications(bday === null)}
      </ol>
    </div>;
  }
});

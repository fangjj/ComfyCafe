import React from "react";
import OnClickOutside from "react-onclickoutside";

import NotificationComponent from "./NotificationComponent";

const NotificationListComponent = React.createClass({
  mixins: [OnClickOutside],
  handleClickOutside(event) {
    if (this.props.visible) {
      this.props.action();
    }
  },
  renderNotifications() {
    if (this.props.notifications.length) {
      return this.props.notifications.map((notification) => {
        return <NotificationComponent
          notification={notification}
          currentUser={this.props.currentUser}
          key={notification._id}
        />;
      });
    }
    return <li>No notifications.</li>;
  },
  render() {
    var classes = "topMenu";
    if (this.props.visible) {
      classes = "topMenu active";
    }

    return <div>
      <div id="notificationArrow" className={classes}></div>
      <ol id="notificationList" className={classes}>
        {this.renderNotifications()}
      </ol>
    </div>;
  }
});

export default NotificationListComponent;

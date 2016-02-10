NotificationListComponent = React.createClass({
  mixins: [OnClickOutside],
  handleClickOutside(event) {
    if (this.props.visible) {
      this.props.action("out");
    }
  },
  renderNotifications() {
    if (this.props.notifications.length) {
      return this.props.notifications.map((notification) => {
        return <NotificationComponent notification={notification} key={notification._id} />;
      });
    }
    return <li>No notifications.</li>;
  },
  render() {
    var classes = "notifications";
    if (this.props.visible) {
      classes = "notifications active";
    }
    return <div>
      <div id="notificationArrow" className={classes}></div>
      <div id="notificationList" className={classes}>
        <ul>
          {this.renderNotifications()}
        </ul>
      </div>
    </div>;
  }
});

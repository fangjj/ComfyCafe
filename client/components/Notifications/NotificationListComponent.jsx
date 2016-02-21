let {
  Menu
} = mui;

NotificationListComponent = React.createClass({
  mixins: [OnClickOutside],
  handleClickOutside(event) {
    if (this.props.visible) {
      this.props.action();
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
    var classes = "topMenu";
    if (this.props.visible) {
      classes = "topMenu active";
    }

    return <div>
      <div id="notificationArrow" className={classes}></div>
      <Menu id="notificationList" className={classes} autoWidth={false}>
        {this.renderNotifications()}
      </Menu>
    </div>;
  }
});

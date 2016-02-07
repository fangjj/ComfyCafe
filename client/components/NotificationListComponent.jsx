NotificationListComponent = React.createClass({
  renderNotifications() {
    if (this.data.notifications) {
      return this.data.notifications.map((notification) => {
        return <NotificationComponent notification={notification} />;
      });
    }
    return <li>No notifications.</li>;
  },
  render() {
    return <div>
      <div id="notificationArrow" className="notifications"></div>
      <div id="notificationList" className="notifications">
        <ul>
          {this.renderNotifications()}
        </ul>
      </div>
    </div>;
  }
});

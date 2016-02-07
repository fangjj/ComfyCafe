NotificationComponent = React.createClass({
  delete(event) {
    event.stopPropagation();
    Meteor.call("deleteNotification", this.props.notification._id);
  },
  render() {
    var notification = this.props.notification;
    var sender = notification.from;
    var senderUrl = FlowRouter.path("profile", {username: sender.username});
    return <li title={sender.username + " " + notification.msg + "!"}>
      <a href={senderUrl}>{sender.username}</a>
      {notification.msg}!
      <i className="deleteNotification material-icons small right" onClick={this.delete}>cancel</i>
    </li>;
  }
});

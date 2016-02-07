NotificationComponent = React.createClass({
  render() {
    var notification = this.props.notification;
    var sender = notification.from;
    var senderUrl = FlowRouter.path("profile", {username: sender.username});
    return <li title={sender.username + " " + notification.msg + "!"}>
      <a href={senderUrl}>{sender.username}</a>
      {notification.msg}!
      <i className="deleteNotification material-icons small right">cancel</i>
    </li>;
  }
});
/*
"click .deleteNotification": function (event, template) {
  event.stopPropagation();
  Meteor.call("deleteNotification", this._id);
}*/

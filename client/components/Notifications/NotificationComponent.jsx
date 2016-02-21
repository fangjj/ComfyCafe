let {
  MenuItem,
  FontIcon
} = mui;

NotificationComponent = React.createClass({
  delete(event) {
    event.stopPropagation();
    Meteor.call("deleteNotification", this.props.notification._id);
  },
  render() {
    var notification = this.props.notification;
    var sender = notification.from;
    var senderUrl = FlowRouter.path("profile", {username: sender.username});
    const rightIcon = <FontIcon
      className="material-icons"
      onTouchTap={this.delete}
    >cancel</FontIcon>;
    return <MenuItem rightIcon={rightIcon}>
      <a href={senderUrl}>{sender.username}</a>
      {notification.msg}!
    </MenuItem>;
  }
});

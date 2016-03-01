let {
  MenuItem,
  FontIcon
} = mui;

const actionMap = {
  subscribed(notification) {
    return "subscribed!";
  },
  topicPosted(notification) {
    return "posted in \"" + notification.topic.name + "\".";
  }
};

NotificationComponent = React.createClass({
  delete(event) {
    event.stopPropagation();
    Meteor.call("deleteNotification", this.props.notification._id);
  },
  renderLabel() {
    return actionMap[this.props.notification.action](this.props.notification);
  },
  render() {
    const rightIcon = <FontIcon
      className="material-icons"
      onTouchTap={this.delete}
    >cancel</FontIcon>;

    return <MenuItem rightIcon={rightIcon} style={{whiteSpace: "normal"}}>
      <UserLink user={this.props.notification.owner} />
      {this.renderLabel()}
    </MenuItem>;
  }
});

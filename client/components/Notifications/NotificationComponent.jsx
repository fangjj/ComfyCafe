let {
  FontIcon
} = mui;

const actionMap = {
  subscribed(notification) {
    return "subscribed!";
  },
  topicPosted(notification) {
    return "posted in \"" + notification.topic.name + "\"";
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

    return <li rightIcon={rightIcon} style={{whiteSpace: "normal"}}>
      <div className="notificationInner">
        <UserLink user={this.props.notification.owner} />
        {this.renderLabel()}
      </div>
      <div className="notificationClose">
        {rightIcon}
      </div>
    </li>;
  }
});

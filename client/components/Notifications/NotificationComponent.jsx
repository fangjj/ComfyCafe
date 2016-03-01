let {
  FontIcon
} = mui;

const actionMap = {
  subscribed(notification) {
    return "subscribed!";
  },
  topicPosted(notification) {
    const url = FlowRouter.path("topic", {
      roomId: notification.topic.room._id,
      topicId: notification.topic._id
    });
    return [
      "posted in ",
      <a href={url} key={_.uniqueId()}>
        {notification.topic.name}
      </a>
    ];
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

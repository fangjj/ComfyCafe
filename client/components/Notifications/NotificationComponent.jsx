let {
  FontIcon
} = mui;

NotificationComponent = React.createClass({
  actionMap: {
    subscribed() {
      return "subscribed!";
    },
    topicPosted() {
      const url = FlowRouter.path("topic", {
        roomId: this.props.notification.topic.room._id,
        topicId: this.props.notification.topic._id
      });
      return [
        "posted in ",
        <a href={url} key={_.uniqueId()} onTouchTap={this.delete}>
          {this.props.notification.topic.name}
        </a>
      ];
    }
  },
  delete(event) {
    event.stopPropagation();
    Meteor.call("deleteNotification", this.props.notification._id);
  },
  renderLabel() {
    return this.actionMap[this.props.notification.action].bind(this)();
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

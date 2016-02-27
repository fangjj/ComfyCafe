TopicListItem = React.createClass({
  renderMoreMenu() {
    var isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.topic.owner._id;
    if (isOwner) {
      return <TopicMoreMenu topic={this.props.topic} currentUser={this.props.currentUser} />;
    }
  },
  renderCountLabel() {
    if (this.props.topic.messageCount !== 1) {
      return "messages";
    } else {
      return "message";
    }
  },
  render() {
    var topic = this.props.topic;
    var topicUrl = FlowRouter.path("topic", {
      roomId: topic.room._id,
      topicId: topic._id
    });

    var owner = topic.owner;
    var ownerUrl = FlowRouter.path("profile", {username: owner.username});

    return <li>
      <div className="flexLayout">
        <div className="leftSIde">
          <a href={ownerUrl}>
            <AvatarComponent size="icon" user={owner} />
          </a>
        </div>
        <div className="rightSide">
          <div className="top">
            <div className="info">
              <a href={topicUrl}>{topic.name}</a>
              <br />
              <Moment time={topic.lastActivity} />
            </div>
            {/*this.renderMoreMenu()*/}
          </div>
        </div>
      </div>
      <div className="bottomLeft">
        <span className="push teal">
          {(topic.messageCount || 0)}
        </span>
      </div>
    </li>;
  }
});

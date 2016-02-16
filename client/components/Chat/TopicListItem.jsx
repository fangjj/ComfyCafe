TopicListItem = React.createClass({
  renderMoreMenu() {
    var isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.topic.owner._id;
    if (isOwner) {
      return <TopicMoreMenu topic={this.props.topic} currentUser={this.props.currentUser} />;
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
            <AvatarComponent class="small" id={owner._id} profile={owner.profile} title={owner.username} />
          </a>
        </div>
        <div className="rightSide">
          <div className="top">
            <div className="info">
              <a href={topicUrl}>{topic.name}</a>
              <br />
              (last activity <Moment time={topic.lastActivity} />)
            </div>
            {this.renderMoreMenu()}
          </div>
        </div>
      </div>
    </li>;
  }
});

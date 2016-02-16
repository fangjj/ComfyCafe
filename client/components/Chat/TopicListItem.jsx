TopicListItem = React.createClass({
  render() {
    var topic = this.props.topic;

    var owner = topic.owner;
    var ownerUrl = FlowRouter.path("profile", {username: owner.username});

    var isoDate = moment(topic.lastActivity).toISOString();
    var prettyDate = moment(topic.lastActivity).fromNow();

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
              {topic.name}
              <br />
              (last activity <time dateTime={isoDate}>{prettyDate}</time>)
            </div>
          </div>
        </div>
      </div>
    </li>;
  }
});

MessageListItem = React.createClass({
  onVisibility(visible) {
    if (visible) {
      this.props.onVisible();
    }
  },
  renderMoreMenu() {
    var isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.message.owner._id;
    if (isOwner) {
      return <MessageMoreMenu message={this.props.message} currentUser={this.props.currentUser} />;
    }
  },
  render() {
    var msg = this.props.message;

    var owner = msg.owner;
    var ownerUrl = FlowRouter.path("profile", {username: owner.username});

    return <li>
      <div className="flexLayout">
        <div className="leftSide">
          <a href={ownerUrl}>
            <AvatarComponent size="small" user={owner} />
          </a>
        </div>
        <div className="rightSide">
          <div className="top">
            <div className="info">
              by <UserLink user={owner} /> <Moment time={msg.createdAt} />
            </div>
            {this.renderMoreMenu()}
          </div>
          <TextBody text={msg.body} className="body" />
        </div>
      </div>
    </li>;
  }
});

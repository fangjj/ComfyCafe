MessageListItem = React.createClass({
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
        <div className="leftSIde">
          <a href={ownerUrl}>
            <AvatarComponent class="small" id={owner._id} profile={owner.profile} title={owner.username} />
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

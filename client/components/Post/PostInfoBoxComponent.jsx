PostInfoBoxComponent = React.createClass({
  delete() {
    Meteor.call("deletePost", this.props.post._id, function () {
      FlowRouter.go(Session.get("previousPath"));
    });
  },
  render() {
    var post = this.props.post;

    var owner = post.owner;
    var ownerUrl = FlowRouter.path("profile", {username: owner.username});
    var isOwner = this.props.currentUser && this.props.currentUser._id === owner._id;

    var subButton;
    if (! isOwner) {
      subButton = <SubscriptionButton owner={owner} currentUser={this.props.currentUser} />;
    } else {
      subButton = <SubtleDangerButton
        label="Delete Post"
        iconName="delete"
        onTouchTap={this.delete}
      />;
    }

    return <section className="infoBox content">
      <div className="flexColumn">
        <div className="flexLayout">
          <div className="leftSIde">
            <a href={ownerUrl}>
              <AvatarComponent size="small" user={owner} />
            </a>
          </div>
          <div className="rightSide">
            <div className="top">
              <div className="info">
                by <UserLink user={owner} /> <Moment time={post.createdAt} />
              </div>
              {/*this.renderMoreMenu()*/}
            </div>
            <div className="action">
              {subButton}
            </div>
          </div>
        </div>
        <TextBody text={this.props.post.description} className="body" />
      </div>
    </section>;
  }
});

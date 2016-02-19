PostInfoBoxComponent = React.createClass({
  delete() {
    Meteor.call("deletePost", this.props.post._id, function () {
      FlowRouter.go(Session.get("previousPath"));
    });
  },
  render() {
    var post = this.props.post;

    var owner = post.uploader;
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

    return <section className="infoBox">
      <div className="meta">
        <a href={ownerUrl}>
          <AvatarComponent class="small" id={owner._id} profile={owner.profile} title={owner.username} />
        </a>
        <div className="info">
          by <UserLink user={owner} /> <Moment time={post.createdAt} />
          <br />
          <div className="action">
            {subButton}
          </div>
        </div>
      </div>
      <TextBody text={this.props.post.description} className="description" />
    </section>;
  }
});

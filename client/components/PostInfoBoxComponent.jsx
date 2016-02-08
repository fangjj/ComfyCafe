PostInfoBoxComponent = React.createClass({
  render() {
    var post = this.props.post;

    var owner = post.uploader;
    var ownerUrl = FlowRouter.path("profile", {username: owner.username});
    var isOwner = this.props.currentUser && this.props.currentUser._id === owner._id;

    var isoDate = moment(post.createdAt).toISOString();
    var prettyDate = moment(post.createdAt).fromNow();

    var subButton;
    if (! isOwner) {
      subButton = <SubscriptionButton owner={owner} />;
    }

    return <div className="postInfo">
      <a href={ownerUrl}>
        <AvatarComponent class="small" id={owner._id} profile={owner.profile} title={owner.username} />
      </a>
      <div className="info">
        by <a href={ownerUrl}>{owner.username}</a> <time dateTime={isoDate}>{prettyDate}</time>
        <br />
        {subButton}
      </div>
    </div>;
  }
});

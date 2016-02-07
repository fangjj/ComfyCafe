PostInfoBoxComponent = React.createClass({
  render() {
    var post = this.props.post;

    var owner = post.uploader;
    var ownerUrl = FlowRouter.path("profile", {username: owner.username});

    var isoDate = moment(post.createdAt).toISOString();
    var prettyDate = moment(post.createdAt).fromNow();

    return <div className="postInfo">
      <a href={ownerUrl}>
        <AvatarComponent class="small" id={owner._id} profile={owner.profile} title={owner.username} />
      </a>
      <div className="info">
        by <a href={ownerUrl}>{owner.username}</a> <time dateTime={isoDate}>{prettyDate}</time>
        <br />
        <SubscriptionButton owner={owner} />
      </div>
    </div>;
  }
});

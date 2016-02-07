PostComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("post", FlowRouter.getParam("postId"));
    return {
      loading: ! handle.ready(),
      post: Posts.findOne({ _id: FlowRouter.getParam("postId") })
    };
  },
  render() {
    if (this.data.loading) {
      return <p>Loading...</p>;
    }

    return <div className="medium">
      <MediumComponent medium={this.data.post.medium} />
      <PostInfoBoxComponent post={this.data.post} />
    </div>;
  }
});

PostInfoBoxComponent = React.createClass({
  render() {
    var post = this.props.post;
    var owner = post.uploader;
    var ownerUrl = FlowRouter.path("profile", {username: owner.username});
    return <div className="postInfo">
      <a href={ownerUrl}>
        <AvatarComponent class="small" id={owner._id} profile={owner.profile} title={owner.username} />
      </a>
      <div className="info">
        by <a href={ownerUrl}>{owner.username}</a>
        <br />
        <SubscriptionButton owner={owner} />
      </div>
    </div>;
  }
});

TagTreeComponent = React.createClass({
  render() {
    return;
  }
});

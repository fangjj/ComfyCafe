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

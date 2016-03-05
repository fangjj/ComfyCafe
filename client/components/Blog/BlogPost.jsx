BlogPost = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const id = FlowRouter.getParam("postId");
    let handle = Meteor.subscribe("blogPost", id);
    return {
      loading: ! handle.ready(),
      post: BlogPosts.findOne({ _id: id }),
      currentUser: Meteor.user()
    };
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    var isOwner = this.data.currentUser
      && this.data.currentUser._id === this.data.post.owner._id;
    var showEditButton = isOwner;

    var fab;
    if (showEditButton) {
      fab = <BlogPostEditFAB post={this.data.post} />;
    }

    return <ol className="contentList">
      <BlogListItem post={this.data.post} currentUser={this.data.currentUser} />
      {fab}
    </ol>;
  }
});

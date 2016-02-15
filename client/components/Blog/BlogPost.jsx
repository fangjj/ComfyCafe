BlogPost = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var id = FlowRouter.getParam("postId");
    var handle;
    var doc = {};
    if (id) {
      handle = Meteor.subscribe("blogPostPerma", FlowRouter.getParam("postId"));
      doc = { _id: id };
    } else {
      handle = Meteor.subscribe("blogPost",
        FlowRouter.getParam("username"),
        FlowRouter.getParam("postName"),
      );
      doc = {
        "owner.username": FlowRouter.getParam("username"),
        name: FlowRouter.getParam("postName")
      };
    }
    return {
      loading: ! handle.ready(),
      post: BlogPosts.findOne(doc),
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

    return <ol className="blog">
      <BlogListItem post={this.data.post} />
      {fab}
    </ol>;
  }
});

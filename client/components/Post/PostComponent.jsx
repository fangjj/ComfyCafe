PostComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var id = FlowRouter.getParam("postId");
    var handle;
    var doc = {};
    if (id) {
      handle = Meteor.subscribe("postPerma", FlowRouter.getParam("postId"));
      doc = { _id: id };
    } else {
      handle = Meteor.subscribe("post",
        FlowRouter.getParam("username"),
        FlowRouter.getParam("postName"),
      );
      doc = {
        "uploader.username": FlowRouter.getParam("username"),
        name: FlowRouter.getParam("postName")
      };
    }
    return {
      loading: ! handle.ready(),
      post: Posts.findOne(doc),
      currentUser: Meteor.user()
    };
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    var isOwner = this.data.currentUser
      && this.data.currentUser._id === this.data.post.uploader._id;
    var showEditButton = isOwner;
    var showFavoriteButton = ! isOwner && this.data.currentUser && this.data.post.medium;

    var medium;
    if (this.data.post) {
      medium = <MediumComponent medium={this.data.post.medium} />;
    } else {
      medium = <Inline404Component />;
    }

    var fab;
    if (showEditButton) {
      fab = <PostModifyFAB post={this.data.post} />;
    }
    if (showFavoriteButton) {
      fab = <FavoriteFAB post={this.data.post} userId={this.data.currentUser._id} />;
    }

    return <article className="post">
      <figure className="medium">
        {medium}
      </figure>
      <PostInfoBoxComponent post={this.data.post} currentUser={this.data.currentUser} />
      <section className="tagBox">
        <TagTreeComponent tags={this.data.post.tags} humanizedTags={this.data.post.humanizedTags} />
      </section>
      {fab}
    </article>;
  }
});

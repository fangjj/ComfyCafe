PostComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("post", FlowRouter.getParam("postId"));
    return {
      loading: ! handle.ready(),
      post: Posts.findOne({ _id: FlowRouter.getParam("postId") }),
      currentUser: Meteor.user()
    };
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    var isOwner = this.data.post.uploader
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

    return <article>
      <figure className="medium">
        {medium}
      </figure>
      <PostInfoBoxComponent post={this.data.post} />
      <div className="tags">
        <TagTreeComponent tags={this.data.post.tags} humanizedTags={this.data.post.humanizedTags} />
      </div>
      {fab}
    </article>;
  }
});

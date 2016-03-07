Post = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const id = FlowRouter.getParam("postId");
    let handle;
    let doc = {};

    if (id) {
      handle = Meteor.subscribe("postPerma", id);
      doc = { _id: id };
    } else {
      handle = Meteor.subscribe("post",
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
      post: Posts.findOne(doc),
      currentUser: Meteor.user()
    };
  },
  renderTags() {
    if (this.data.post.tags.text) {
      return <section className="tagBox content">
        <TagTreeComponent tags={this.data.post.tags} humanizedTags={this.data.post.humanizedTags} />
      </section>;
    }
  },
  renderLikes() {
    if (this.data.post.likes && this.data.post.likes.length) {
      return <PostLikes likes={this.data.post.likes} />;
    }
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    if (! this.data.post) {
      return <Inline404Component />;
    }

    var isOwner = this.data.currentUser
      && this.data.currentUser._id === this.data.post.owner._id;
    var showEditButton = isOwner;
    var showFavoriteButton = ! isOwner && this.data.currentUser && this.data.post.medium;

    var fab;
    if (showEditButton) {
      fab = <PostModifyFAB post={this.data.post} />;
    }
    if (showFavoriteButton) {
      fab = <PostLikeFAB post={this.data.post} userId={this.data.currentUser._id} />;
    }

    setPattern(this.data.post.name);

    return <article className="post contentLayout">
      <figure className="content">
        <Medium
          medium={this.data.post.medium} 
          pretentiousFilter={this.data.post.pretentiousFilter}
        />
      </figure>
      <PostInfoBox post={this.data.post} currentUser={this.data.currentUser} />
      {this.renderTags()}
      <section className="comments content">
        <InlineTopic
          topicId={this.data.post.topic._id}
          currentUser={this.data.currentUser}
        />
      </section>
      {this.renderLikes()}
      {fab}
    </article>;
  }
});

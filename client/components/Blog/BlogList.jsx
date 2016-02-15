BlogList = React.createClass({
  /*mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("blogFeed");
    return {
      loading: ! handle.ready(),
      posts: BlogPosts.find(
        { $or: [
          { "owner._id": Meteor.userId() },
          { "owner._id": { $in: Meteor.user() && Meteor.user().subscriptions || [] } }
        ] },
        { sort: { createdAt: -1, title: 1 } }
      ).fetch(),
      currentUser: Meteor.user()
    };
  },*/
  renderPosts() {
    /*if (this.data.posts.length) {
      return this.data.posts.map((post) => {
        return <BlogPost post={post} key={post._id} />;
      });
    }
    return <li>No posts.</li>;*/
    var posts = [
      {body: "topkek", _id: 0},
      {body: "kektop", _id: 1}
    ];
    return posts.map((post) => {
      return <BlogPost post={post} key={post._id} />;
    });
  },
  render() {
    /*if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    if (! this.data.currentUser) {
      return <PowerlessComponent />;
    }*/

    return <ol className="blog">
      {this.renderPosts()}
    </ol>;
  }
});

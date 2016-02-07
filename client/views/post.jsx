PostComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function () {
    var handle = Meteor.subscribe("post", FlowRouter.getParam("postId"));
    return {
      loading: ! handle.ready(),
      post: Posts.findOne({ _id: FlowRouter.getParam("postId") })
    };
  },
  render: function () {
    if (this.data.loading) {
      return <p>Loading...</p>;
    }

    return <div className="medium">
      <p>{this.data.post._id}</p>
      <MediumComponent medium={this.data.post.medium} />
    </div>;
  }
});

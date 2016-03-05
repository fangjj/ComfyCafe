CommentList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    let handle = Meteor.subscribe("commentsFor", this.props.post._id);
    return {
      loading: ! handle.ready(),
      comments: Comments.find(
        { "post._id": this.props.post._id },
        { sort: { createdAt: -1 } }
      ).fetch(),
      currentUser: Meteor.user()
    };
  },
  renderComments() {
    if (this.data.comments.length) {
      return this.data.comments.map((comment) => {
        return <CommentListItem
          comment={comment}
          currentUser={this.data.currentUser}
          key={comment._id}
        />;
      });
    }
  },
  render() {
    return <ol className="list">
      <li>
        <CommentInlineForm
          post={this.props.post}
          afterSubmit={() => {}}
        />
      </li>
      {this.renderComments()}
    </ol>;
  }
});

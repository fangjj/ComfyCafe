BlogUpdateForm = React.createClass({
  handleSubmit(data) {
    Meteor.call("updateBlogPost", this.props.post._id, data, (err) => {
      this.props.handleClose();
    });
  },
  render() {
    return <BlogDialog
      title="Edit Blog Post"
      open={this.props.open}
      modal={false}
      handleClose={this.props.handleClose}
      handleSubmit={this.handleSubmit}
      post={this.props.post}
    />;
  }
});

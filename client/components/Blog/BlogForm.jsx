BlogForm = React.createClass({
  handleSubmit(data) {
    Meteor.call("addBlogPost", data, (err, name) => {
      this.props.handleClose();
    });
  },
  render() {
    return <BlogDialog
      title="Write Blog Post"
      open={this.props.open}
      modal={false}
      handleClose={this.props.handleClose}
      handleSubmit={this.handleSubmit}
    />;
  }
});

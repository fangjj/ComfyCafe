let {
  FloatingActionButton,
  FontIcon
} = mui;

BlogPostFAB = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showBlogForm() {
    this.setState({showForm: true});
  },
  hideBlogForm() {
    this.setState({showForm: false});
  },
  render() {
    return <div className="fixed-action-btn">
      <FloatingActionButton secondary={true} onTouchTap={this.showBlogForm}>
        <FontIcon className="material-icons">add</FontIcon>
      </FloatingActionButton>
      <BlogForm
        handleClose={this.hideBlogForm}
        open={this.state.showForm}
      />
    </div>;
  }
});

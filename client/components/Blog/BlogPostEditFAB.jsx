import React from "react";

let {
  FloatingActionButton,
  FontIcon
} = mui;

BlogPostEditFAB = React.createClass({
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
      <FloatingActionButton secondary={true} onClick={this.showBlogForm}>
        <FontIcon className="material-icons">edit</FontIcon>
      </FloatingActionButton>
      <BlogUpdateForm
        post={this.props.post}
        handleClose={this.hideBlogForm}
        open={this.state.showForm}
      />
    </div>;
  }
});

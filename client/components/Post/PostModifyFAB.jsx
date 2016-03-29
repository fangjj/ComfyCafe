import React from "react";

let {
  FloatingActionButton,
  FontIcon
} = mui;

PostModifyFAB = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showPostForm() {
    this.setState({showForm: true});
  },
  hidePostForm() {
    this.setState({showForm: false});
  },
  render() {
    return <div className="fixed-action-btn">
      <FloatingActionButton secondary={true} onTouchTap={this.showPostForm}>
        <FontIcon className="material-icons">edit</FontIcon>
      </FloatingActionButton>
      <PostUpdateForm
        post={this.props.post}
        handleClose={this.hidePostForm}
        open={this.state.showForm}
      />
    </div>;
  }
});

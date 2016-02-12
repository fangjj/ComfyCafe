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
  destroyPostForm() {
    this.setState({showForm: false});
  },
  renderPostForm() {
    if (this.state.showForm) {
      return <PostUpdateFormComponent post={this.props.post} destroy={this.destroyPostForm} />;
    }
  },
  render() {
    return <div id="fabModify" className="fixed-action-btn">
      <FloatingActionButton secondary={true} onClick={this.showPostForm}>
        <FontIcon className="material-icons">edit</FontIcon>
      </FloatingActionButton>
      {this.renderPostForm()}
    </div>;
  }
});

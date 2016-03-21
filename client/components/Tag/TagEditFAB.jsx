let {
  FloatingActionButton,
  FontIcon
} = mui;

TagEditFAB = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showTagForm() {
    this.setState({showForm: true});
  },
  hideTagForm() {
    this.setState({showForm: false});
  },
  render() {
    return <div className="fixed-action-btn">
      <FloatingActionButton secondary={true} onClick={this.showTagForm}>
        <FontIcon className="material-icons">edit</FontIcon>
      </FloatingActionButton>
      <TagUpdateForm
        tag={this.props.tag}
        handleClose={this.hideTagForm}
        open={this.state.showForm}
      />
    </div>;
  }
});

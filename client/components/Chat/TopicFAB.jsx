let {
  FloatingActionButton,
  FontIcon
} = mui;

TopicFAB = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showTopicForm() {
    this.setState({showForm: true});
  },
  hideTopicForm() {
    this.setState({showForm: false});
  },
  render() {
    return <div className="fixed-action-btn">
      <FloatingActionButton secondary={true} onTouchTap={this.showTopicForm}>
        <FontIcon className="material-icons">add</FontIcon>
      </FloatingActionButton>
      <TopicForm
        handleClose={this.hideTopicForm}
        open={this.state.showForm}
        room={this.props.room}
      />
    </div>;
  }
});

let {
  FlatButton,
  FontIcon
} = mui;

TopicFlatButton = React.createClass({
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
    return <div>
      <FlatButton
        icon={<FontIcon className="material-icons">add</FontIcon>}
        label="New Topic"
        onTouchTap={this.showTopicForm}
      />
      <TopicForm
        handleClose={this.hideTopicForm}
        open={this.state.showForm}
        room={this.props.room}
      />
    </div>;
  }
});

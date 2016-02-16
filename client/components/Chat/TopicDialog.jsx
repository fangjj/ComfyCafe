let {
  Dialog,
  FlatButton,
  RaisedButton
} = mui;

TopicDialog = React.createClass({
  getInitialState() {
    if (this.props.room) {
      return {
        name: this.props.topic.name,
        visibility: this.props.topic.visibility
      };
    } else {
      return {
        name: generateTopic(),
        visibility: "public"
      };
    }
  },
  handleName(event) {
    this.setState({name: event.target.value});
  },
  handleVisibility(event, index, value) {
    this.setState({visibility: value});
  },
  handleSubmit() {
    this.props.handleSubmit({
      name: this.state.name,
      visibility: this.state.visibility
    });
  },
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        labelStyle={{fontSize: "18px"}}
        secondary={true}
        onTouchTap={this.props.handleClose}
      />,
      <FlatButton
        label="Submit"
        labelStyle={{fontSize: "18px"}}
        primary={true}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return <Dialog
      className="topicForm"
      title={this.props.title}
      actions={actions}
      modal={this.props.modal}
      open={this.props.open}
      autoScrollBodyContent={true}
      onRequestClose={this.props.handleClose}
    >
      <TopicInnerForm
        name={this.state.name}
        handleName={this.handleName}
        visibility={this.state.visibility}
        handleVisibility={this.handleVisibility}
      />
    </Dialog>;
  }
});

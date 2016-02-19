let {
  FloatingActionButton,
  FontIcon
} = mui;

MessageFAB = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showMessageForm() {
    this.setState({showForm: true});
  },
  hideMessageForm() {
    this.setState({showForm: false});
  },
  render() {
    return <div className="fixed-action-btn">
      <FloatingActionButton secondary={true} onTouchTap={this.showMessageForm}>
        <FontIcon className="material-icons">add</FontIcon>
      </FloatingActionButton>
      <MessageForm
        handleClose={this.hideMessageForm}
        open={this.state.showForm}
        topic={this.props.topic}
      />
    </div>;
  }
});

let {
  Dialog,
  FlatButton,
  RaisedButton
} = mui;

MessageDialog = React.createClass({
  getInitialState() {
    if (this.props.message) {
      return {
        body: this.props.message.body
      };
    } else {
      return {
        body: ""
      };
    }
  },
  handleBody(event) {
    this.setState({
      body: event.target.value
    });
  },
  handleSubmit() {
    this.props.handleSubmit({
      body: this.state.body
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
      className="messageForm"
      title={this.props.title}
      actions={actions}
      modal={this.props.modal}
      open={this.props.open}
      autoScrollBodyContent={true}
      onRequestClose={this.props.handleClose}
    >
      <MessageInnerForm
        body={this.state.body}
        handleBody={this.handleBody}
      />
    </Dialog>;
  }
});

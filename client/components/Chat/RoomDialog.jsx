let {
  Dialog,
  FlatButton,
  RaisedButton
} = mui;

RoomDialog = React.createClass({
  getInitialState() {
    if (this.props.room) {
      return {
        name: this.props.room.name,
        visibility: this.props.room.visibility
      };
    } else {
      return {
        name: generateName({adjCount: 2, delim: " "}),
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
      className="roomForm"
      title={this.props.title}
      actions={actions}
      modal={this.props.modal}
      open={this.props.open}
      autoScrollBodyContent={true}
      onRequestClose={this.props.handleClose}
    >
      <RoomInnerForm
        name={this.state.name}
        handleName={this.handleName}
        visibility={this.state.visibility}
        handleVisibility={this.handleVisibility}
      />
    </Dialog>;
  }
});

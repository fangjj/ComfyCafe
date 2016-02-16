RoomForm = React.createClass({
  handleSubmit(data) {
    Meteor.call("addRoom", data, (err, name) => {
      this.props.handleClose();
    });
  },
  render() {
    return <RoomDialog
      title="Create Room"
      open={this.props.open}
      modal={false}
      handleClose={this.props.handleClose}
      handleSubmit={this.handleSubmit}
    />;
  }
});

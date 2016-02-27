RoomForm = React.createClass({
  handleSubmit(data) {
    Meteor.call("addRoom", data, (err, roomId) => {
      this.props.handleClose();
      var path = FlowRouter.path("room", {roomId: roomId});
      FlowRouter.go(path);
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
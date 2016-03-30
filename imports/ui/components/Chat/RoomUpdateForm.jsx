import React from "react";

import "/imports/api/rooms/methods";

import RoomDialog from "./RoomDialog";

const RoomUpdateForm = React.createClass({
  handleSubmit(data) {
    Meteor.call("updateRoom", this.props.room._id, data, (err) => {
      this.props.handleClose();
    });
  },
  render() {
    return <RoomDialog
      title="Edit Room"
      open={this.props.open}
      modal={false}
      handleClose={this.props.handleClose}
      handleSubmit={this.handleSubmit}
      room={this.props.room}
    />;
  }
});

export default RoomUpdateForm;

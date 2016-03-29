import React from "react";

const Room = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var id = FlowRouter.getParam("roomId");
    var handle = Meteor.subscribe("room", id);
    return {
      loading: ! handle.ready(),
      room: Rooms.findOne({ _id: id }),
      currentUser: Meteor.user()
    };
  },
  renderMoreMenu() {
    var isOwner = this.data.currentUser
      && this.data.currentUser._id === this.data.room.owner._id;
    if (isOwner) {
      return <div className="topRight">
        <RoomMoreMenu
          room={this.data.room}
          currentUser={this.data.currentUser}
          redirect={true}
        />
      </div>;
    }
  },
  render() {
    if (this.data.loading || ! this.data.room) {
      return <DenseLoadingSpinner />;
    }

    const room = this.data.room;

    setTitle(room.name);

    return <div>
      <header>
        {this.renderMoreMenu()}
        <h2>{room.name}</h2>
      </header>
    </div>;
  }
});

export default Room;

import React from "react";

import Rooms from "/imports/api/rooms/collection";
import setTitle from "/imports/api/common/setTitle";

import RoomMoreMenu from "./RoomMoreMenu";
import RoomInnerForm from "./RoomInnerForm";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";
import TextBody from "/imports/ui/client/components/TextBody";

export default React.createClass({
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
  renderDescription(room) {
    if (room.description) {
      return <section>
        <header>
          <h3>Description</h3>
        </header>
        <TextBody text={room.description} />
      </section>;
    }
  },
  renderRules(room) {
    if (room.rules) {
      return <section>
        <header>
          <h3>Rules</h3>
        </header>
        <TextBody text={room.rules} />
      </section>;
    }
  },
  renderProfile() {
    const room = this.data.room;
    return <div className="denseBox">
      {this.renderDescription(room)}
      {this.renderRules(room)}
    </div>;
  },
  renderForm(isOwner) {
    if (isOwner) {
      return <RoomInnerForm />;
    }
  },
  render() {
    if (this.data.loading || ! this.data.room) {
      return <DenseLoadingSpinner />;
    }

    const room = this.data.room;

    setTitle(room.name);

    const isOwner = this.data.currentUser && this.data.currentUser._id === this.data.room.owner._id;

    return <div>
      <header>
        {this.renderMoreMenu(isOwner)}
        <h2>{room.name}</h2>
      </header>
      <div className="denseBox">
        {this.renderProfile()}
        {this.renderForm(isOwner)}
      </div>
    </div>;
  }
});

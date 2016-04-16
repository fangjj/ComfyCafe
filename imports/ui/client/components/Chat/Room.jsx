import React from "react";

import Rooms from "/imports/api/rooms/collection";
import setTitle from "/imports/api/common/setTitle";

import RoomForm from "./RoomForm";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";
import TextBody from "/imports/ui/client/components/TextBody";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import DangerButton from "/imports/ui/client/components/Button/DangerButton";
import ButtonGroup from "/imports/ui/client/components/Button/ButtonGroup";
import ActionWell from "/imports/ui/client/components/ActionWell";

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return { showForm: false };
  },
  showRoomForm() {
    this.setState({ showForm: true });
  },
  hideRoomForm() {
    this.setState({ showForm: false });
  },
  getMeteorData() {
    const id = FlowRouter.getParam("roomId");
    const handle = Meteor.subscribe("room", id);
    return {
      loading: ! handle.ready(),
      room: Rooms.findOne({ _id: id }),
      currentUser: Meteor.user()
    };
  },
  delete() {
    Meteor.call("deleteRoom", this.data.room._id, () => {
      const path = FlowRouter.path("roomList");
      FlowRouter.go(path);
    });
  },
  renderEditButtons(isOwner) {
    if (isOwner) {
      return <ButtonGroup>
        <SubmitButton
          label="Edit"
          iconName="edit"
          onTouchTap={this.showRoomForm}
        />
        <DangerButton
          label="Delete"
          iconName="close"
          subtle={true}
          onTouchTap={this.delete}
        />
      </ButtonGroup>;
    } else {
      return <ButtonGroup>
        <SubmitButton
          label="Experience Happiness"
          iconName="sentiment_satisfied"
        />
      </ButtonGroup>;
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
    if (! this.state.showForm) {
      const room = this.data.room;
      return <div className="denseBox">
        {this.renderDescription(room)}
        {this.renderRules(room)}
      </div>;
    }
  },
  renderForm(isOwner) {
    if (isOwner && this.state.showForm) {
      return <RoomForm
        room={this.data.room}
        onClose={this.hideRoomForm}
      />;
    }
  },
  render() {
    if (this.data.loading || ! this.data.room) {
      return <DenseLoadingSpinner />;
    }

    const room = this.data.room;

    setTitle(room.name);

    const isOwner = this.data.currentUser && this.data.currentUser._id === this.data.room.owner._id;

    return <section>
      <header>
        <h2>{room.name}</h2>
        <ActionWell>
          {this.renderEditButtons(isOwner)}
          <ButtonGroup>
            <SubmitButton
              label="Drop the Bass"
              iconName="all_out"
            />
          </ButtonGroup>
        </ActionWell>
      </header>
      <div className="denseBox">
        {this.renderProfile()}
        {this.renderForm(isOwner)}
      </div>
    </section>;
  }
});

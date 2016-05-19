import React from "react";

import Rooms from "/imports/api/rooms/collection";
import setTitle from "/imports/api/common/setTitle";
import RoomForm from "./RoomForm";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";
import TextBody from "/imports/ui/client/components/TextBody";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import DangerButton from "/imports/ui/client/components/Button/DangerButton";
import ReportButton from "/imports/ui/client/components/Button/ReportButton";
import ButtonGroup from "/imports/ui/client/components/Button/ButtonGroup";
import ActionWell from "/imports/ui/client/components/ActionWell";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import UserSearch from "/imports/ui/client/components/User/UserSearch";

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return { showForm: false };
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
    this.setState({ showForm: false });
  },
  getMeteorData() {
    const slug = FlowRouter.getParam("roomSlug");
    const handle = Meteor.subscribe("room", slug);
    return {
      loading: ! handle.ready(),
      room: Rooms.findOne({ slug }),
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
          onTouchTap={this.showForm}
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
          label="Join"
          iconName="sentiment_satisfied"
        />
        <ReportButton />
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
  renderProfile(room) {
    if (! this.state.showForm) {
      const desc = this.renderDescription(room);
      const rules = this.renderRules(room);
      if (desc || rules) {
        return <div className="denseBox">
          {desc}
          {rules}
        </div>;
      }
    }
  },
  renderForm(isOwner) {
    if (isOwner && this.state.showForm) {
      return <div className="denseBox">
        <RoomForm
          room={this.data.room}
          redirect={true}
          actions={true}
          onClose={this.hideForm}
        />
      </div>;
    }
  },
  renderMembers(room) {
    if (room.members.length) {
      return <UserSearch title="Members" userIds={room.members} />;
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
        <div className="hotdog hide-on-med-and-up" onTouchTap={this.props.activateLeft}>
          <Icon>menu</Icon>
        </div>
        <h2>{room.name}</h2>
        <ActionWell>
          {this.renderEditButtons(isOwner)}
          <div />
        </ActionWell>
      </header>
      {this.renderProfile(room)}
      {this.renderForm(isOwner)}
      {this.renderMembers(room)}
    </section>;
  }
});

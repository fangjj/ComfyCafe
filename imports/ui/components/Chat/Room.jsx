import React from "react";

import Rooms from "/imports/api/rooms/collection";
import { isPriveleged } from "/imports/api/common/persimmons";
import setTitle from "/imports/ui/utils/setTitle";
import RoomForm from "./RoomForm";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import TextBody from "/imports/ui/components/TextBody";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import DangerButton from "/imports/ui/components/Button/DangerButton";
import ReportButton from "/imports/ui/components/Button/ReportButton";
import JoinButton from "/imports/ui/components/Button/JoinButton";
import ButtonGroup from "/imports/ui/components/Button/ButtonGroup";
import ActionWell from "/imports/ui/components/ActionWell";
import Icon from "/imports/ui/components/Daikon/Icon";
import UserSearch from "/imports/ui/components/User/UserSearch";
import DialogForm from "/imports/ui/components/DialogForm";
import ReportForm from "/imports/ui/components/Report/ReportForm";

export default React.createClass({
  mixins: [ReactMeteorData],
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    return { showForm: false, showReportForm: false };
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
      room: Rooms.findOne({ slug })
    };
  },
  delete() {
    Meteor.call("deleteRoom", this.data.room._id, () => {
      const path = FlowRouter.path("roomList");
      FlowRouter.go(path);
    });
  },
  showReportForm() {
    this.setState({ showReportForm: true });
  },
  hideReportForm() {
    this.setState({ showReportForm: false });
  },
  renderReportForm() {
    if (this.state.showReportForm) {
      return <DialogForm
        title="Report Community"
        id={"formReport" + this.data.room._id}
        onClose={this.hideReportForm}
        form={<ReportForm
          item={this.data.room}
          itemType="community"
        />}
      />;
    }
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
        <ReportButton onTouchTap={this.showReportForm} />
      </ButtonGroup>;
    }
  },
  renderAdminButton() {
    const roomSlug = this.data.room.slug;
    if (isPriveleged(this.context.currentUser._id, "community_" + roomSlug)) {
      return <SubmitButton
        label="Admin"
        iconName="gavel"
        linkButton={true}
        href={FlowRouter.path("communityAdmin", { roomSlug })}
      />;
    } return null;
  },
  renderJoinButton(isOwner) {
    if (! isOwner) {
      return <JoinButton room={this.data.room} />;
    } return null;
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
      return <UserSearch id={"members" + room._id} title="Members" userIds={room.members} />;
    }
  },
  render() {
    if (this.data.loading || ! this.data.room) {
      return <DenseLoadingSpinner />;
    }

    const room = this.data.room;

    setTitle(room.name);

    const isOwner = this.context.currentUser && this.context.currentUser._id === this.data.room.owner._id;

    return <section>
      <header>
        <div className="hotdog hide-on-med-and-up" onTouchTap={this.props.activateLeft}>
          <Icon>menu</Icon>
        </div>
        <h2>{room.name}</h2>
        <ActionWell>
          {this.renderEditButtons(isOwner)}
          <ButtonGroup>
            {this.renderAdminButton()}
            {this.renderJoinButton(isOwner)}
          </ButtonGroup>
        </ActionWell>
      </header>
      {this.renderProfile(room)}
      {this.renderForm(isOwner)}
      {this.renderMembers(room)}
      {this.renderReportForm()}
    </section>;
  }
});

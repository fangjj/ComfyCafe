import React from "react";

import Rooms from "/imports/api/rooms/collection";
import Invites from "/imports/api/invites/collection";
import { isAdmin, isMod, isPriveleged, isMember } from "/imports/api/common/persimmons";
import setTitle from "/imports/ui/utils/setTitle";
import RoomForm from "./RoomForm";
import InviteUsers from "/imports/ui/components/Chat/InviteUsers";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import Content from "/imports/ui/components/Content";
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
    const inviteHandle = Meteor.subscribe("yourInvites", slug);
    return {
      loading: ! handle.ready(),
      inviteLoading: ! inviteHandle.ready(),
      room: Rooms.findOne({ slug }),
      invite: Invites.findOne(
        {
    			to: Meteor.userId(),
    			"community.slug": slug
    		}
      )
    };
  },
  isInvited() {
    if (! this.context.currentUser) {
      return false;
    }
    if (isMember(this.context.currentUser, "community_" + this.data.room.slug)) {
      return true;
    }
    if (this.data.room.requireInvite) {
      return Boolean(this.data.invite);
    } return true;
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
          onClick={this.showForm}
        />
        <DangerButton
          label="Delete"
          iconName="close"
          subtle={true}
          onClick={this.delete}
        />
      </ButtonGroup>;
    } else {
      return <ButtonGroup>
        <ReportButton onClick={this.showReportForm} />
      </ButtonGroup>;
    }
  },
  renderAdminButton() {
    const roomSlug = this.data.room.slug;
    if (this.context.currentUser
      && isPriveleged(this.context.currentUser._id, "community_" + roomSlug)
    ) {
      return <SubmitButton
        label="Admin"
        iconName="gavel"
        linkButton={true}
        href={FlowRouter.path("communityAdmin", { roomSlug })}
      />;
    } return null;
  },
  renderJoinButton(isOwner) {
    if (! isOwner && this.isInvited()) {
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
  renderInvite(community) {
    const group = "community_" + community.slug;
    if (
      this.context.currentUser
      && (
        (community.membersCanInvite && isMember(this.context.currentUser._id, group))
        || (community.moderatorsCanInvite && isMod(this.context.currentUser._id, group))
        || (community.adminsCanInvite && isAdmin(this.context.currentUser._id, group))
      )
    ) {
      return <Content>
        <InviteUsers community={community} />
      </Content>;
    } return null;
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
        <div className="hotdog hide-on-med-and-up" onClick={this.props.activateLeft}>
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
      {this.renderInvite(room)}
      {this.renderMembers(room)}
      {this.renderReportForm()}
    </section>;
  }
});

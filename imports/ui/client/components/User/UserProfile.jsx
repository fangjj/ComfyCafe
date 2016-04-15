import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import setTitle from "/imports/api/common/setTitle";

import UserInfo from "./UserInfo";
import UserProfileForm from "./UserProfileForm";
import Content from "/imports/ui/client/components/Content";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import SubscriptionButton from "/imports/ui/client/components/Button/SubscriptionButton";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import CancelButton from "/imports/ui/client/components/Button/CancelButton";
import FriendButton from "/imports/ui/client/components/Button/FriendButton";
import DangerButton from "/imports/ui/client/components/Button/DangerButton";
import ButtonGroup from "/imports/ui/client/components/Button/ButtonGroup";
import ActionWell from "/imports/ui/client/components/ActionWell";
import DirectAvatar from "/imports/ui/client/components/Avatar/DirectAvatar";
import AvatarCropper from "/imports/ui/client/components/Avatar/AvatarCropper";

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const handle = Meteor.subscribe("user", FlowRouter.getParam("username"));
    return {
      loading: ! handle.ready(),
      user: Meteor.users.findOne({ username: FlowRouter.getParam("username") }),
      currentUser: Meteor.user()
    };
  },
  getInitialState() {
    return {
      isEditing: false,
      isChangingAvatar: false
    };
  },
  startEditing(event) {
    this.setState({ isEditing: true });
  },
  stopEditing(event) {
    this.setState({ isEditing: false });
  },
  startChangingAvatar(event) {
    this.setState({ isChangingAvatar: true });
  },
  stopChangingAvatar(event) {
    this.setState({ isChangingAvatar: false });
  },
  deleteAvatar(event) {
    Meteor.call("deleteAvatar");
  },
  renderInfo() {
    const info = _.get(this.data.user, "profile.info", {});
    const order = _.get(this.data.user, "profile.infoOrder", []);
    if (! this.state.isEditing && ! _.isEmpty(info)) {
      return <UserInfo info={info} order={order} />;
    }
  },
  renderAvatar(isOwner) {
    return <DirectAvatar size="large" user={this.data.user} editable={isOwner} />;
  },
  renderEditButtons(isOwner) {
    if (isOwner) {
      let button = <SubmitButton
        label="Edit"
        iconName="edit"
        onTouchTap={this.startEditing}
      />;

      if (this.state.isEditing) {
        button = <CancelButton
          onTouchTap={this.stopEditing}
        />;
      }

      return <ButtonGroup>
        {button}
      </ButtonGroup>;
    } else {
      return <ButtonGroup>
        <SubscriptionButton owner={this.data.user} currentUser={this.data.currentUser} />
        <FriendButton
          user={this.data.user}
          currentUser={this.data.currentUser}
        />
      </ButtonGroup>;
    }
  },
  renderToolbox(isOwner) {
    if (isOwner) {
      const hasAvatar = _.has(this.data.user, "avatars");

      let deleteButton;
      if (hasAvatar) {
        deleteButton = <DangerButton
          label="Delete Avatar"
          iconName="delete"
          subtle={true}
          onTouchTap={this.deleteAvatar}
        />;
      }

      return <ButtonGroup>
        <SubmitButton
          label="Change Avatar"
          iconName="image"
          onTouchTap={this.startChangingAvatar}
        />
        {deleteButton}
      </ButtonGroup>;
    } else {
      return <ButtonGroup>
        <SubmitButton
          label="Send Good Vibes"
          iconName="wb_sunny"
        />
      </ButtonGroup>;
    }
  },
  renderCatchphrase() {
    const catchphrase = _.get(this.data.user, "profile.blurb");
    if (catchphrase) {
      return <span className="catchphrase">
        {catchphrase}
      </span>;
    }
  },
  renderForm(isOwner) {
    if (isOwner && this.state.isEditing) {
      return <UserProfileForm
        currentUser={this.data.user}
        onCancel={this.stopEditing}
      />;
    }
  },
  renderInner(isOwner, displayName) {
    if (! this.state.isChangingAvatar) {
      return <div className="flexColumn">
        <div className="flexLayout">
          <div className="leftSide">
            {this.renderAvatar(isOwner)}
          </div>
          <div className="rightSide">
            <header>
              <h2>{displayName}</h2>
              {this.renderCatchphrase()}
            </header>
          </div>
        </div>
        <ActionWell>
          {this.renderEditButtons(isOwner)}
          {this.renderToolbox(isOwner)}
        </ActionWell>
      </div>;
    } else {
      return <AvatarCropper cancelAction={this.stopChangingAvatar} />;
    }
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinner />;
    }

    const user = this.data.user;
    const isOwner = this.data.currentUser && this.data.currentUser._id === user._id;

    const displayName = user.profile.displayName || user.username;
    setTitle(displayName);

    return <Content className="profile">
      {this.renderInner(isOwner, displayName)}
      {this.renderInfo()}
      {this.renderForm(isOwner)}
    </Content>;
  }
});

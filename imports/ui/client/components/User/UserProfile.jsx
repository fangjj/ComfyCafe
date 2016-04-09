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
import Button from "/imports/ui/client/components/Button/Button";
import FriendButton from "/imports/ui/client/components/Button/FriendButton";
import DangerButton from "/imports/ui/client/components/Button/DangerButton";
import DirectAvatar from "/imports/ui/client/components/Avatar/DirectAvatar";
import AvatarCropper from "/imports/ui/client/components/Avatar/AvatarCropper";

const UserProfile = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("user", FlowRouter.getParam("username"));
    return {
      loading: ! handle.ready(),
      user: Meteor.users.findOne({ username: FlowRouter.getParam("username") }),
      currentUser: Meteor.user()
    };
  },
  getInitialState() {
    return {
      isChangingAvatar: false
    }
  },
  startChangingAvatar(event) {
    this.setState({
      isChangingAvatar: true
    });
  },
  stopChangingAvatar(event) {
    this.setState({
      isChangingAvatar: false
    });
  },
  deleteAvatar(event) {
    Meteor.call("deleteAvatar");
  },
  renderInfo(isOwner) {
    const info = _.get(this.data.user, "profile.info", {});
    const order = _.get(this.data.user, "profile.infoOrder", []);
    if (! isOwner && ! _.isEmpty(info)) {
      return <UserInfo info={info} order={order} />;
    }
  },
  renderForm(isOwner) {
    if (isOwner) {
      return <UserProfileForm currentUser={this.data.user} />;
    }
  },
  renderAvatar(isOwner) {
    return <DirectAvatar size="large" user={this.data.user} editable={isOwner} />;
  },
  renderToolbox(isOwner) {
    if (! isOwner) {
      return <div>
        <SubscriptionButton owner={this.data.user} currentUser={this.data.currentUser} />
        <FriendButton
          user={this.data.user}
          currentUser={this.data.currentUser}
        />
      </div>;
    } else {
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

      return <div>
        <Button
          label="Change Avatar"
          iconName="image"
          onTouchTap={this.startChangingAvatar}
        />
        {deleteButton}
      </div>;
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
            <div>
              {this.renderToolbox(isOwner)}
            </div>
          </div>
        </div>
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
      {this.renderInfo(isOwner)}
      {this.renderForm(isOwner)}
    </Content>;
  }
});

export default UserProfile;

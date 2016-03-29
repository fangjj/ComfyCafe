import _ from "lodash";
import React from "react";

import UserProfileForm from "./UserProfileForm";
import LoadingSpinner from "../LoadingSpinner";
import SubscriptionButton from "../SubscriptionButton";
import FriendButton from "../FriendButton";
import SubtleDangerButton from "../SubtleDangerButton";
import DirectAvatar from "../Avatar/DirectAvatar";
import AvatarCropper from "../Avatar/AvatarCropper";

import {
  RaisedButton,
  FontIcon
} from "material-ui";

const UserProfileComponent = React.createClass({
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
  renderForm(isOwner) {
    if (isOwner && ! this.state.isChangingAvatar) {
      return <UserProfileForm currentUser={this.data.user} />;
    }
  },
  render() {
    if (this.data.loading ||
      (this.data.currentUser && ! _.has(this.data.currentUser, "profile"))
    ) {
      return <LoadingSpinner />;
    }

    var user = this.data.user;
    var isOwner = this.data.currentUser && this.data.currentUser._id === user._id;

    var displayName = user.profile.displayName || user.username;
    setTitle(displayName);

    var toolbox;
    if (! isOwner) {
      var imagesPath = FlowRouter.path("imagesBy", {username: this.data.user.username});
      var pagesPath = FlowRouter.path("blogBy", {username: this.data.user.username});
      toolbox = <div className="toolbox">
        <SubscriptionButton owner={user} currentUser={this.data.currentUser} />
        <FriendButton
          user={user}
          currentUser={this.data.currentUser}
        />
        <br />
        <RaisedButton
          label="View Images"
          labelStyle={{fontSize: "18px"}}
          secondary={true}
          icon={<FontIcon className="material-icons">image</FontIcon>}
          linkButton={true}
          href={imagesPath}
        />
        <RaisedButton
          label="View Blog"
          labelStyle={{fontSize: "18px"}}
          secondary={true}
          icon={<FontIcon className="material-icons">import_contacts</FontIcon>}
          linkButton={true}
          href={pagesPath}
        />
      </div>;
    } else {
      var hasAvatar = _.has(user, "avatars");

      var deleteButton;
      if (hasAvatar) {
        deleteButton = <SubtleDangerButton
          label="Delete Avatar"
          iconName="delete"
          onTouchTap={this.deleteAvatar}
        />;
      }

      toolbox = <div className="toolbox">
        <RaisedButton
          label="Change Avatar"
          labelStyle={{fontSize: "18px"}}
          secondary={true}
          icon={<FontIcon className="material-icons">image</FontIcon>}
          onTouchTap={this.startChangingAvatar}
        />
        {deleteButton}
      </div>;
    }

    var content;
    if (! this.state.isChangingAvatar) {
      content = <div>
        <DirectAvatar size="large" user={user} />
        {toolbox}
      </div>;
    } else {
      content = <div>
        <AvatarCropper cancelAction={this.stopChangingAvatar} />
      </div>;
    }

    return <div className="content">
      <header>
  			<h2>{displayName}</h2>
  		</header>
			{content}
      {this.renderForm(isOwner)}
    </div>;
  }
});

export default UserProfileComponent;

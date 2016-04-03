import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import setTitle from "/imports/api/common/setTitle";

import UserProfileForm from "./UserProfileForm";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import SubscriptionButton from "/imports/ui/client/components/Button/SubscriptionButton";
import FriendButton from "/imports/ui/client/components/Button/FriendButton";
import SubtleDangerButton from "/imports/ui/client/components/Button/SubtleDangerButton";
import DirectAvatar from "../Avatar/DirectAvatar";
import AvatarCropper from "../Avatar/AvatarCropper";

import {
  RaisedButton
} from "material-ui";

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
  renderForm(isOwner) {
    if (isOwner && ! this.state.isChangingAvatar) {
      return <UserProfileForm currentUser={this.data.user} />;
    }
  },
  render() {
    if (this.data.loading) {
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
          primary={true}
          icon={<Icon>image</Icon>}
          linkButton={true}
          href={imagesPath}
        />
        <RaisedButton
          label="View Blog"
          labelStyle={{fontSize: "18px"}}
          primary={true}
          icon={<Icon>import_contacts</Icon>}
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
          primary={true}
          icon={<Icon>image</Icon>}
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

export default UserProfile;

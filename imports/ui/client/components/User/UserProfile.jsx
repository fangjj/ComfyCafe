import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import setTitle from "/imports/api/common/setTitle";
import UserInfo from "/imports/ui/client/components/User/UserInfo";
import UserProfileForm from "/imports/ui/client/components/User/UserProfileForm";
import UserSearch from "/imports/ui/client/components/User/UserSearch";
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
import BadgeGroup from "/imports/ui/client/components/BadgeGroup";

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
  renderBadges() {
    return <BadgeGroup badges={_.get(this.data.user, "profile.badges", {})} />;
  },
  renderStats(user) {
    const path = (where) => FlowRouter.path(where, { username: user.username });
    const count = (what) => _.get(user.profile, what + "Count", 0);
    return <div className="genericCol">
      <a href={path("imagesBy")}>
        <Icon className="sigil">image</Icon> {count("image")} Images
      </a>
      <a href={path("blogBy")}>
        <Icon className="sigil">weekend</Icon> {count("blog")} Blog Posts
      </a>
      <a href={path("pagesBy")}>
        <Icon className="sigil">import_contacts</Icon> {count("page")} Pages
      </a>
      <a href={path("albumsBy")}>
        <Icon className="sigil">collections</Icon> {count("album")} Albums
      </a>
    </div>;
  },
  renderForm(isOwner) {
    if (isOwner && this.state.isEditing) {
      return <UserProfileForm
        currentUser={this.data.user}
        actions={true}
        onClose={this.stopEditing}
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
              {this.renderBadges()}
            </header>
            {this.renderStats(this.data.user)}
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
  renderFriends(user) {
    if (user.friends.length) {
      return <UserSearch title="Friends" userIds={user.friends} />;
    }
  },
  renderSubscriptions(user) {
    if (user.subscriptions.length) {
      return <UserSearch title="Subscriptions" userIds={user.subscriptions} />;
    }
  },
  renderSubscribers(user) {
    if (user.subscribers.length) {
      return <UserSearch title="Subscribers" userIds={user.subscribers} />;
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

    user.friends = _.get(user, "friends", []);
    user.subscribers = _.get(user, "subscribers", []);
    user.subscribers = _.difference(user.subscribers, user.friends);
    user.subscriptions = _.get(user, "subscriptions", []);
    user.subscriptions = _.difference(user.subscriptions, user.friends);

    return <article className="contentLayout">
      <Content className="profile">
        {this.renderInner(isOwner, displayName)}
        {this.renderInfo()}
        {this.renderForm(isOwner)}
      </Content>

      {this.renderFriends(user)}
      {this.renderSubscriptions(user)}
      {this.renderSubscribers(user)}
    </article>;
  }
});

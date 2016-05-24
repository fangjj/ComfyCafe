import _ from "lodash";
import React from "react";
import moment from "moment";

import "/imports/api/users/methods";
import setTitle from "/imports/api/common/setTitle";
import getOrdinal from "/imports/ui/utils/ordinal";
import statusLabel from "/imports/ui/utils/statusLabel";
import UserInfo from "/imports/ui/components/User/UserInfo";
import UserStatus from "/imports/ui/components/User/UserStatus";
import UserProfileForm from "/imports/ui/components/User/UserProfileForm";
import UserSearch from "/imports/ui/components/User/UserSearch";
import Content from "/imports/ui/components/Content";
import Icon from "/imports/ui/components/Daikon/Icon";
import LoadingSpinner from "/imports/ui/components/Spinner/LoadingSpinner";
import SubscriptionButton from "/imports/ui/components/Button/SubscriptionButton";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import CancelButton from "/imports/ui/components/Button/CancelButton";
import FriendButton from "/imports/ui/components/Button/FriendButton";
import DangerButton from "/imports/ui/components/Button/DangerButton";
import ReportButton from "/imports/ui/components/Button/ReportButton";
import ReportForm from "/imports/ui/components/Report/ReportForm";
import ButtonGroup from "/imports/ui/components/Button/ButtonGroup";
import DialogForm from "/imports/ui/components/DialogForm";
import ActionWell from "/imports/ui/components/ActionWell";
import DirectAvatar from "/imports/ui/components/Avatar/DirectAvatar";
import AvatarCropper from "/imports/ui/components/Avatar/AvatarCropper";
import BadgeGroup from "/imports/ui/components/BadgeGroup";
import TextBody from "/imports/ui/components/TextBody";

export default React.createClass({
  mixins: [ReactMeteorData],
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    return {
      isEditing: false,
      isChangingAvatar: false,
      showReportForm: false
    };
  },
  getMeteorData() {
    const handle = Meteor.subscribe("user", FlowRouter.getParam("username"));
    return {
      loading: ! handle.ready(),
      user: Meteor.users.findOne(
        { normalizedUsername: FlowRouter.getParam("username").toLowerCase() }
      )
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
  showReportForm() {
    this.setState({ showReportForm: true });
  },
  hideReportForm() {
    this.setState({ showReportForm: false });
  },
  renderReportForm() {
    if (this.state.showReportForm) {
      return <DialogForm
        title="Report User"
        id={"formReport" + this.data.user._id}
        onClose={this.hideReportForm}
        form={<ReportForm
          item={this.data.user}
          itemType="user"
        />}
      />;
    }
  },
  renderBio(user) {
    const bio = _.get(user, "profile.bio");
    if (bio) {
      return <TextBody text={bio} className="body" />;
    }
  },
  renderInfo(user) {
    const info = _.get(user, "profile.info", {});
    const order = _.get(user, "profile.infoOrder", []);
    if (! _.isEmpty(info)) {
      return <UserInfo info={info} order={order} />;
    }
  },
  renderBelowWell(user) {
    const bio = this.renderBio(user);
    const info = this.renderInfo(user);
    if (! this.state.isEditing && (bio || info)) {
      return <div className="belowWell">
        {bio}
        {info}
      </div>;
    }
  },
  renderAvatar(isOwner) {
    return <DirectAvatar
      size="large"
      user={this.data.user}
      safety={_.get(this.data.user, "profile.avatarSafety", 0)}
      editable={isOwner}
    />;
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
        <SubscriptionButton owner={this.data.user} currentUser={this.context.currentUser} />
        <FriendButton
          user={this.data.user}
          currentUser={this.context.currentUser}
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
        <ReportButton onTouchTap={this.showReportForm} />
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
  renderBirthday(user) {
    const birthday = _.get(user, "profile.birthday");
    if (birthday) {
      const month = moment().month(birthday.month-1).format("MMMM");
      return <div>
        <Icon className="sigil">cake</Icon> {month} {getOrdinal(birthday.day)}
      </div>;
    }
  },
  renderStats(user) {
    const path = (where) => FlowRouter.path(where, { username: user.username });
    const count = (what) => _.get(user.profile, what + "Count", 0);
    return <div className="genericCol">
      <div className="stat">
        <UserStatus user={user} /> {_.capitalize(statusLabel(user))}
      </div>
      {this.renderBirthday(user)}
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
        user={this.context.currentUser}
        actions={true}
        onClose={this.stopEditing}
      />;
    }
  },
  renderInner(isOwner, displayName) {
    const user = this.data.user;
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
            {this.renderStats(user)}
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
    const isOwner = this.context.currentUser && this.context.currentUser._id === user._id;

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
        {this.renderBelowWell(user)}
        {this.renderForm(isOwner)}
      </Content>

      {this.renderFriends(user)}
      {this.renderSubscriptions(user)}
      {this.renderSubscribers(user)}

      {this.renderReportForm()}
    </article>;
  }
});

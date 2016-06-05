import _ from "lodash";
import React from "react";
import moment from "moment";
import IconButton from "material-ui/IconButton";

import "/imports/api/users/methods";
import "/imports/api/notifications/methods";
import getOrdinal from "/imports/ui/utils/ordinal";
import Icon from "/imports/ui/components/Daikon/Icon";
import DangerButton from "/imports/ui/components/Button/DangerButton";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import ButtonGroup from "/imports/ui/components/Button/ButtonGroup";
import UserLink from "/imports/ui/components/User/UserLink";

export default React.createClass({
  actionMap: {
    subscribed() {
      return "subscribed!";
    },
    happyBirthday() {
      return "Happy birthday!";
    },
    birthdayReminder() {
      const birthday = this.props.notification.birthday;
      const month = moment().month(birthday.month-1).format("MMMM");
      const day = getOrdinal(birthday.day);
      return `was born on ${month} ${day}, which is probably tomorrow. Don't forget!`;
    },
    friendRequest() {
      return {
        label: "wants to be friends! ",
        buttons: <ButtonGroup key={"fr_" + this.props.notification._id}>
          <DangerButton
            label="Reject"
            onTouchTap={() => {
              Meteor.call("rejectFriendRequest", this.props.notification._id);
            }}
          />
          <SubmitButton
            label="Accept"
            onTouchTap={() => {
              Meteor.call("acceptFriendRequest", this.props.notification._id);
            }}
          />
        </ButtonGroup>
      };
    },
    friendAccepted() {
      return "accepted your friend request!";
    },
    friendRejected() {
      return [
        "rejected your friend request. ",
        <a href="https://youtu.be/W9A52UWmmrE" key={this.props.notification._id}>
          Chin up!
        </a>
      ];
    },
    postLiked() {
      const url = FlowRouter.path("post", {
        username: this.props.currentUser.username,
        postName: this.props.notification.post.name
      });
      return [
        "liked ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.post.name}
        </a>
      ];
    },
    postMentioned() {
      const url = FlowRouter.path("post", {
        username: this.props.notification.owner.username,
        postName: this.props.notification.post.name
      });
      return [
        "mentioned you in ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.post.name}
        </a>
      ];
    },
    postCommented() {
      const url = FlowRouter.path("post", {
        username: this.props.notification.post.username,
        postName: this.props.notification.post.name
      }) + "#" + this.props.notification.message._id;
      return [
        "commented on ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.post.name}
        </a>
      ];
    },
    albumCommented() {
      const url = FlowRouter.path("album", {
        username: this.props.notification.album.username,
        albumSlug: this.props.notification.album.slug
      }) + "#" + this.props.notification.message._id;
      return [
        "commented on ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.album.name}
        </a>
      ];
    },
    pageCommented() {
      const url = FlowRouter.path("page", {
        username: this.props.notification.page.username,
        slug: this.props.notification.page.slug
      }) + "#" + this.props.notification.message._id;
      return [
        "commented on ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.page.name}
        </a>
      ];
    },
    blogCommented() {
      const url = FlowRouter.path("blogPost", {
        username: this.props.notification.blog.username,
        slug: this.props.notification.blog.slug
      }) + "#" + this.props.notification.message._id;
      return [
        "commented on ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.blog.name}
        </a>
      ];
    },
    postCommentMentioned() {
      const url = FlowRouter.path("post", {
        username: this.props.notification.post.username,
        postName: this.props.notification.post.name
      }) + "#" + this.props.notification.message._id;
      return [
        "mentioned you in a comment on ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.post.name}
        </a>
      ];
    },
    albumCommentMentioned() {
      const url = FlowRouter.path("album", {
        username: this.props.notification.album.username,
        albumSlug: this.props.notification.album.slug
      }) + "#" + this.props.notification.message._id;
      return [
        "mentioned you in a comment on ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.album.name}
        </a>
      ];
    },
    pageCommentMentioned() {
      const url = FlowRouter.path("page", {
        username: this.props.notification.page.username,
        slug: this.props.notification.page.slug
      }) + "#" + this.props.notification.message._id;
      return [
        "mentioned you in a comment on ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.page.name}
        </a>
      ];
    },
    blogCommentMentioned() {
      const url = FlowRouter.path("blogPost", {
        username: this.props.notification.blog.username,
        slug: this.props.notification.blog.slug
      }) + "#" + this.props.notification.message._id;
      return [
        "mentioned you in a comment on ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.blog.name}
        </a>
      ];
    },
    albumMentioned() {
      const url = FlowRouter.path("album", {
        username: this.props.notification.owner.username,
        albumSlug: this.props.notification.album.slug || "???"
      });
      return [
        "mentioned you in ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.album.name}
        </a>
      ];
    },
    pageMentioned() {
      const url = FlowRouter.path("page", {
        username: this.props.notification.owner.username,
        slug: this.props.notification.page.slug
      });
      return [
        "mentioned you in ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.page.name}
        </a>
      ];
    },
    blogMentioned() {
      const url = FlowRouter.path("blogPost", {
        username: this.props.notification.owner.username,
        slug: this.props.notification.blog.slug
      });
      return [
        "mentioned you in ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.blog.name}
        </a>
      ];
    },
    reblogged() {
      const url = FlowRouter.path("blogPost", {
        username: this.props.notification.owner.username,
        slug: this.props.notification.blog.slug
      });
      return [
        "reblogged your post ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.blog.name}
        </a>
      ];
    },
    topicPosted() {
      const url = FlowRouter.path("topic", {
        roomSlug: this.props.notification.topic.room.slug,
        topicSlug: this.props.notification.topic.slug
      }) + "#" + this.props.notification.message._id;
      return [
        "posted in ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.topic.name}
        </a>
      ];
    },
    topicMentioned() {
      const url = FlowRouter.path("topic", {
        roomSlug: this.props.notification.topic.room.slug,
        topicSlug: this.props.notification.topic.slug
      }) + "#" + this.props.notification.message._id;
      return [
        "mentioned you in ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.topic.name}
        </a>
      ];
    },
    invited() {
      const url = FlowRouter.path("room", { roomSlug: this.props.notification.room.slug });
      return [
        "invited you to join ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.room.name}
        </a>,
        "!"
      ];
    },
    joined() {
      const url = FlowRouter.path("room", { roomSlug: this.props.notification.room.slug });
      return [
        "joined ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.room.name}
        </a>,
        "!"
      ];
    },
    inviteAccepted() {
      const url = FlowRouter.path("room", { roomSlug: this.props.notification.room.slug });
      return [
        "accepted your invite for ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          {this.props.notification.room.name}
        </a>,
        "!"
      ];
    },
    directMessaged() {
      const url = FlowRouter.path("dm", { username: this.props.notification.owner.username });
      return [
        "sent you a ",
        <a href={url} key={this.props.notification._id} onTouchTap={this.dismiss}>
          direct message
        </a>,
        "."
      ];
    },
  },
  dismiss(event) {
    event.stopPropagation();
    Meteor.call("dismissNotification", this.props.notification._id);
  },
  render() {
    let label = this.actionMap[this.props.notification.action].bind(this)();
    let buttons;
    if (_.has(label, "buttons")) {
      buttons = label.buttons;
      label = label.label;
    }
    return <li>
      <div className="row">
        <div className="inner">
          <UserLink user={this.props.notification.owner} />
          <span className="label">
            {label}
          </span>
        </div>
        <IconButton className="dismiss" onTouchTap={this.dismiss}>
          <Icon>close</Icon>
        </IconButton>
      </div>
      {buttons}
    </li>;
  }
});

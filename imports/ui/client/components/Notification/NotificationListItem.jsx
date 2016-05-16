import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import "/imports/api/notifications/methods";

import Icon from "/imports/ui/client/components/Daikon/Icon";
import DangerButton from "/imports/ui/client/components/Button/DangerButton";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import ButtonGroup from "/imports/ui/client/components/Button/ButtonGroup";
import UserLink from "/imports/ui/client/components/User/UserLink";

import {
  IconButton
} from "material-ui";

export default React.createClass({
  actionMap: {
    subscribed() {
      return "subscribed!";
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
        <a href="https://youtu.be/W9A52UWmmrE" key={_.uniqueId()}>
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
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
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
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
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
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
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
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
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
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
          {this.props.notification.page.name}
        </a>
      ];
    },
    blogCommented() {
      const url = FlowRouter.path("blog", {
        username: this.props.notification.blog.username,
        slug: this.props.notification.blog.slug
      }) + "#" + this.props.notification.message._id;
      return [
        "commented on ",
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
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
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
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
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
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
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
          {this.props.notification.page.name}
        </a>
      ];
    },
    blogCommentMentioned() {
      const url = FlowRouter.path("blog", {
        username: this.props.notification.blog.username,
        slug: this.props.notification.blog.slug
      }) + "#" + this.props.notification.message._id;
      return [
        "mentioned you in a comment on ",
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
          {this.props.notification.blog.name}
        </a>
      ];
    },
    albumMentioned() {
      const url = FlowRouter.path("album", {
        username: this.props.notification.owner.username,
        albumSlug: this.props.notification.album.slug
      });
      return [
        "mentioned you in ",
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
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
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
          {this.props.notification.page.name}
        </a>
      ];
    },
    blogMentioned() {
      const url = FlowRouter.path("blogPost", {
        postId: this.props.notification.blog._id
      });
      return [
        "mentioned you in ",
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
          Untitled
        </a>
      ];
    },
    topicPosted() {
      const url = FlowRouter.path("topic", {
        roomSlug: this.props.notification.topic.room.slug,
        topicId: this.props.notification.topic._id
      }) + "#" + this.props.notification.message._id;
      return [
        "posted in ",
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
          {this.props.notification.topic.name}
        </a>
      ];
    },
    topicMentioned() {
      const url = FlowRouter.path("topic", {
        roomSlug: this.props.notification.topic.room.slug,
        topicId: this.props.notification.topic._id
      }) + "#" + this.props.notification.message._id;
      return [
        "mentioned you in ",
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
          {this.props.notification.topic.name}
        </a>
      ];
    }
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

import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import "/imports/api/notifications/methods";

import Icon from "/imports/ui/client/components/Daikon/Icon";
import UserLink from "/imports/ui/client/components/User/UserLink";

import {
  FlatButton,
  IconButton
} from "material-ui";

export default React.createClass({
  actionMap: {
    subscribed() {
      return "subscribed!";
    },
    friendRequest() {
      return [
        "wants to be friends! ",
        <FlatButton
          label="Reject"
          key={_.uniqueId()}
          onTouchTap={() => {
            Meteor.call("rejectFriendRequest", this.props.notification._id);
          }}
        />,
        <FlatButton
          label="Accept"
          key={_.uniqueId()}
          onTouchTap={() => {
            Meteor.call("acceptFriendRequest", this.props.notification._id);
          }}
        />
      ];
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
      });
      return [
        "commented on ",
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
          {this.props.notification.post.name}
        </a>
      ];
    },
    commentMentioned() {
      const url = FlowRouter.path("post", {
        username: this.props.notification.post.username,
        postName: this.props.notification.post.name
      });
      return [
        "mentioned you in a comment on ",
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
          {this.props.notification.post.name}
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
        roomId: this.props.notification.topic.room._id,
        topicId: this.props.notification.topic._id
      });
      return [
        "posted in ",
        <a href={url} key={_.uniqueId()} onTouchTap={this.dismiss}>
          {this.props.notification.topic.name}
        </a>
      ];
    },
    topicMentioned() {
      const url = FlowRouter.path("topic", {
        roomId: this.props.notification.topic.room._id,
        topicId: this.props.notification.topic._id
      });
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
  renderLabel() {
    return <span className="label">
      {this.actionMap[this.props.notification.action].bind(this)()}
    </span>;
  },
  render() {
    return <li>
      <div className="row">
        <div className="inner">
          <UserLink user={this.props.notification.owner} />
          {this.renderLabel()}
        </div>
        <IconButton className="dismiss" onTouchTap={this.dismiss}>
          <Icon>close</Icon>
        </IconButton>
      </div>
    </li>;
  }
});

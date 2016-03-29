import React from "react";

import {
  FontIcon,
  FlatButton
} from "material-ui";

NotificationComponent = React.createClass({
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
    return this.actionMap[this.props.notification.action].bind(this)();
  },
  render() {
    const rightIcon = <FontIcon
      className="material-icons"
      onTouchTap={this.dismiss}
    >cancel</FontIcon>;

    return <li rightIcon={rightIcon} style={{whiteSpace: "normal"}}>
      <div className="notificationInner">
        <UserLink user={this.props.notification.owner} />
        {this.renderLabel()}
      </div>
      <div className="notificationClose">
        {rightIcon}
      </div>
    </li>;
  }
});

import _ from "lodash";
import React from "react";

import Moment from "/imports/ui/components/Moment";
import Avatar from "/imports/ui/components/Avatar/Avatar";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  renderMoreMenu() {
    const isOwner = this.context.currentUser
      && this.context.currentUser._id === this.props.topic.owner._id;
    if (isOwner) {
      return <TopicMoreMenu topic={this.props.topic} currentUser={this.context.currentUser} />;
    }
  },
  renderCountLabel() {
    if (this.props.topic.messageCount !== 1) {
      return "messages";
    } else {
      return "message";
    }
  },
  render() {
    const topic = this.props.topic;

    const owner = expr(() => {
      if (! this.props.dm) {
        return topic.owner;
      } else {
        if (topic.owner0._id !== this.context.currentUser._id) {
          return topic.owner0;
        }
        if (topic.owner1._id !== this.context.currentUser._id) {
          return topic.owner1;
        }
      }
    });

    const topicUrl = expr(() => {
      if (! this.props.dm) {
        return FlowRouter.path("topic", {
          roomSlug: topic.room.slug,
          topicSlug: topic.slug
        });
      } else {
        return FlowRouter.path("dm", {
          username: owner.username
        });
      }
    });

    const ownerUrl = FlowRouter.path("profile", { username: owner.username });

    const topicName = expr(() => {
      if (! this.props.dm) {
        return topic.name;
      } else {
        return _.get(owner, "profile.displayName", owner.username);
      }
    });

    return <li className="topicListItem">
      <div className="flexLayout">
        <div className="rightSide">
          <div className="top">
            <div className="info">
              <a href={topicUrl}>{topicName}</a>
              <br />
              <Moment time={topic.lastActivity} />
            </div>
          </div>
        </div>
      </div>
      <div className="bottomLeft">
        <span className="push teal">
          {(topic.messageCount || 0)}
        </span>
      </div>
      <a className="fill" href={topicUrl} onTouchTap={this.props.deactivateLeft}></a>
      <div className="pin">
        <a href={ownerUrl}>
          <Avatar size="icon" user={owner} />
        </a>
      </div>
    </li>;
  }
});

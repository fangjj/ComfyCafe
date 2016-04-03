import React from "react";

import VisibilityLink from "../VisibilityLink";
import Moment from "../Moment";
import Avatar from "../Avatar/Avatar";

const TopicListItem = React.createClass({
  renderMoreMenu() {
    var isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.topic.owner._id;
    if (isOwner) {
      return <TopicMoreMenu topic={this.props.topic} currentUser={this.props.currentUser} />;
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
    const topicUrl = FlowRouter.path("topic", {
      roomId: topic.room._id,
      topicId: topic._id
    });

    const owner = topic.owner;
    const ownerUrl = FlowRouter.path("profile", {username: owner.username});

    return <li className="topicListItem">
      <div className="flexLayout">
        <div className="leftSide">
          <a href={ownerUrl}>
            <Avatar size="icon" user={owner} />
          </a>
        </div>
        <div className="rightSide">
          <div className="top">
            <div className="info">
              <VisibilityLink
                href={topicUrl}
                visibility={topic.visibility}
              >{topic.name}</VisibilityLink>
              <br />
              <Moment time={topic.lastActivity} />
            </div>
            {/*this.renderMoreMenu()*/}
          </div>
        </div>
      </div>
      <div className="bottomLeft">
        <span className="push teal">
          {(topic.messageCount || 0)}
        </span>
      </div>
    </li>;
  }
});

export default TopicListItem;

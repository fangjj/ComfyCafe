import React from "react";

import MessageMoreMenu from "./MessageMoreMenu";
import TextBody from "../TextBody";
import Moment from "../Moment";
import Avatar from "../Avatar/Avatar";
import UserLink from "../User/UserLink";

const MessageListItem = React.createClass({
  onVisibility(visible) {
    if (visible) {
      this.props.onVisible();
    }
  },
  renderMoreMenu() {
    var isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.message.owner._id;
    if (isOwner) {
      return <MessageMoreMenu message={this.props.message} currentUser={this.props.currentUser} />;
    }
  },
  render() {
    const msg = this.props.message;

    const owner = msg.owner;
    const ownerUrl = FlowRouter.path("profile", {username: owner.username});

    return <li id={msg._id}>
      <div className="flexLayout">
        <div className="leftSide">
          <a href={ownerUrl}>
            <Avatar size="small" user={owner} />
          </a>
        </div>
        <div className="rightSide">
          <div className="top">
            <div className="info">
              by <UserLink user={owner} /> <Moment time={msg.createdAt} />
              &nbsp;<a href={"#" + msg._id}>(link)</a>
            </div>
            {this.renderMoreMenu()}
          </div>
          <TextBody text={msg.body} className="body" />
        </div>
      </div>
    </li>;
  }
});

export default MessageListItem;

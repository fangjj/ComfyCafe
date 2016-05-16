import _ from "lodash";
import React from "react";

import MessageMoreMenu from "/imports/ui/client/components/Chat/MessageMoreMenu";
import TextBody from "/imports/ui/client/components/TextBody";
import Moment from "/imports/ui/client/components/Moment";
import Avatar from "/imports/ui/client/components/Avatar/Avatar";
import UserLink from "/imports/ui/client/components/User/UserLink";

export default React.createClass({
  onVisibility(visible) {
    if (visible) {
      this.props.onVisible();
    }
  },
  renderEdited(msg, wasEdited) {
    if (wasEdited) {
      return <span> (edited <Moment time={msg.updatedAt} />)</span>;
    }
  },
  renderMoreMenu() {
    const isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.message.owner._id;
    if (isOwner) {
      return <MessageMoreMenu message={this.props.message} currentUser={this.props.currentUser} />;
    }
  },
  render() {
    const msg = this.props.message;

    const owner = msg.owner;
    const ownerUrl = FlowRouter.path("profile", {username: owner.username});

    const wasEdited = ! _.isEqual(msg.createdAt, msg.updatedAt);

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
              <UserLink user={owner} /> <Moment time={msg.createdAt} />
              {this.renderEdited(msg, wasEdited)}
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

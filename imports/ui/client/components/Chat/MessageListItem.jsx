import _ from "lodash";
import React from "react";

import MessageMoreMenu from "/imports/ui/client/components/Chat/MessageMoreMenu";
import MessageForm from "/imports/ui/client/components/Chat/MessageForm";
import TextBody from "/imports/ui/client/components/TextBody";
import Moment from "/imports/ui/client/components/Moment";
import Avatar from "/imports/ui/client/components/Avatar/Avatar";
import UserLink from "/imports/ui/client/components/User/UserLink";

export default React.createClass({
  getInitialState() {
    return { isEditing: false };
  },
  startEditing() {
    this.setState({ isEditing: true });
  },
  stopEditing() {
    this.setState({ isEditing: false });
  },
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
  renderBody(msg) {
    if (! this.state.isEditing) {
      return <TextBody text={msg.body} className="body" />;
    } else {
      return <MessageForm
        message={msg}
        actions={true}
        onClose={this.stopEditing}
      />;
    }
  },
  renderMoreMenu() {
    const isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.message.owner._id;
    if (isOwner) {
      return <MessageMoreMenu
        message={this.props.message}
        currentUser={this.props.currentUser}
        onEdit={this.startEditing}
      />;
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
          {this.renderBody(msg)}
        </div>
      </div>
    </li>;
  }
});

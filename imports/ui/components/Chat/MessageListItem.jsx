import _ from "lodash";
import React from "react";

import { isMod } from "/imports/api/common/persimmons";
import MessageMoreMenu from "/imports/ui/components/Chat/MessageMoreMenu";
import MessageForm from "/imports/ui/components/Chat/MessageForm";
import TextBody from "/imports/ui/components/TextBody";
import Moment from "/imports/ui/components/Moment";
import Avatar from "/imports/ui/components/Avatar/Avatar";
import UserLink from "/imports/ui/components/User/UserLink";
import ModButton from "/imports/ui/components/ModButton";
import ReportButton from "/imports/ui/components/Button/ReportButton";
import DialogForm from "/imports/ui/components/DialogForm";
import ReportForm from "/imports/ui/components/Report/ReportForm";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    return { isEditing: false, showReportForm: false };
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
        title="Report Blog Post"
        id={"formReport" + this.props.message._id}
        onClose={this.hideReportForm}
        form={<ReportForm
          item={this.props.message}
          itemType="message"
        />}
      />;
    }
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
  renderMoreMenu(msg) {
    if (! this.context.currentUser) {
      return;
    }

    const isOwner = this.context.currentUser._id === msg.owner._id;
    if (isOwner) {
      return <MessageMoreMenu
        message={this.props.message}
        currentUser={this.context.currentUser}
        onEdit={this.startEditing}
        dmWith={this.props.dmWith}
      />;
    } else {
      if (isMod(this.context.currentUser._id)) {
        return <ModButton item={msg} itemType="message" />;
      } else if (isMod(this.context.currentUser._id, "community_" + msg.topic.room.slug)) {
        return <ModButton item={msg} itemType="message" community={msg.topic.room.slug} />;
      } else {
        return <ReportButton icon={true} onClick={this.showReportForm} />;
      }
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
            {this.renderMoreMenu(msg)}
          </div>
          {this.renderBody(msg)}
        </div>
      </div>
      {this.renderReportForm()}
    </li>;
  }
});

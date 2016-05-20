import _ from "lodash";
import React from "react";

import { isMod } from "/imports/api/common/persimmons";
import MessageMoreMenu from "/imports/ui/client/components/Chat/MessageMoreMenu";
import MessageForm from "/imports/ui/client/components/Chat/MessageForm";
import TextBody from "/imports/ui/client/components/TextBody";
import Moment from "/imports/ui/client/components/Moment";
import Avatar from "/imports/ui/client/components/Avatar/Avatar";
import UserLink from "/imports/ui/client/components/User/UserLink";
import ModButton from "/imports/ui/client/components/ModButton";
import ReportButton from "/imports/ui/client/components/Button/ReportButton";
import DialogForm from "/imports/ui/client/components/DialogForm";
import ReportForm from "/imports/ui/client/components/Report/ReportForm";

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
      />;
    } else {
      if (isMod(this.context.currentUser._id)) {
        return <ModButton item={msg} itemType="message" />;
      } else {
        return <ReportButton icon={true} onTouchTap={this.showReportForm} />;
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

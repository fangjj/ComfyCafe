import React from "react";

import Topics from "/imports/api/topics/collection";
import Rooms from "/imports/api/rooms/collection";
import "/imports/api/topics/methods";
import { isMember } from "/imports/api/common/persimmons";
import setTitle from "/imports/ui/utils/setTitle";
import MessageList from "./MessageList";
import TopicForm from "./TopicForm";
import Dialog from "/imports/ui/components/Dialog";
import WatchButton from "/imports/ui/components/Button/WatchButton";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import DangerButton from "/imports/ui/components/Button/DangerButton";
import ReportButton from "/imports/ui/components/Button/ReportButton";
import ButtonGroup from "/imports/ui/components/Button/ButtonGroup";
import ActionWell from "/imports/ui/components/ActionWell";
import PrivacyIcon from "/imports/ui/components/Daikon/PrivacyIcon";
import Moment from "/imports/ui/components/Moment";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import Icon from "/imports/ui/components/Daikon/Icon";
import DialogForm from "/imports/ui/components/DialogForm";
import ReportForm from "/imports/ui/components/Report/ReportForm";
import Err403 from "/imports/ui/components/Err403";
import Err404 from "/imports/ui/components/Err404";

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return { showForm: false, showReportForm: false };
  },
  getMeteorData() {
    const roomSlug = FlowRouter.getParam("roomSlug");
    const slug = FlowRouter.getParam("topicSlug");
    const handle = Meteor.subscribe("topic", slug);
    return {
      loading: ! handle.ready(),
      topic: Topics.findOne(
        {
          "room.slug": roomSlug,
          slug
        }
      ),
      room: Rooms.findOne({ slug: roomSlug }),
      currentUser: Meteor.user()
    };
  },
  updateTitle(n) {
    const body = this.data.topic.name;
    let pre = "";
    if (n) {
      pre = "(" + n + ") ";
    }
    setTitle(pre + body);
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
    this.setState({ showForm: false });
  },
  delete() {
    const path = FlowRouter.path("room", { roomSlug: this.data.topic.room.slug });
    Meteor.call("deleteTopic", this.data.topic._id, () => {
      FlowRouter.go(path);
    });
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
        title="Report Topic"
        id={"formReport" + this.data.topic._id}
        onClose={this.hideReportForm}
        form={<ReportForm
          item={this.data.topic}
          itemType="topic"
        />}
      />;
    }
  },
  renderEditButtons() {
    const isOwner = this.data.currentUser
      && this.data.currentUser._id === this.data.topic.owner._id;
    if (isOwner) {
      return <ButtonGroup>
        <SubmitButton
          label="Edit"
          iconName="edit"
          onTouchTap={this.showForm}
        />
        <DangerButton
          label="Delete"
          iconName="close"
          subtle={true}
          onTouchTap={this.delete}
        />
      </ButtonGroup>;
    } else {
      return <ButtonGroup>
        <ReportButton onTouchTap={this.showReportForm} />
      </ButtonGroup>;
    }
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Edit Topic"
        formId={"form" + this.data.topic._id}
        open={true}
        onClose={this.hideForm}
      >
        <TopicForm
          id={"form" + this.data.topic._id}
          topic={this.data.topic}
          onClose={this.hideForm}
        />
      </Dialog>;
    }
  },
  render() {
    if (this.data.loading) {
      return <DenseLoadingSpinner />;
    }

    if (this.data.room.membersOnlyView 
      && (
        ! this.data.currentUser
        || ! isMember(this.data.currentUser._id, "community_" + this.data.room.slug)
      )
    ) {
      setTitle("Rejected!");
      return <Err403 />;
    }

    if (! this.data.topic) {
      setTitle("Topic not found");
      return <Err404 />;
    }

    const topic = this.data.topic;

    const room = topic.room;
    const roomUrl = FlowRouter.path("room", { roomSlug: room.slug });

    return <section className="msgList">
      <header>
        <div className="hotdog hide-on-med-and-up" onTouchTap={this.props.activateLeft}>
          <Icon>menu</Icon>
        </div>
        <h2>{topic.name}</h2>
        <ActionWell>
          {this.renderEditButtons()}
          <ButtonGroup>
            <WatchButton
              topic={this.data.topic}
              currentUser={this.data.currentUser}
            />
          </ButtonGroup>
        </ActionWell>
      </header>
      <MessageList
        topic={this.data.topic}
        currentUser={this.data.currentUser}
        updateTitle={this.updateTitle}
      />
      {this.renderForm()}
      {this.renderReportForm()}
    </section>;
  }
});

import React from "react";

import Topics from "/imports/api/topics/collection";
import "/imports/api/topics/methods";
import setTitle from "/imports/api/common/setTitle";
import MessageList from "./MessageList";
import TopicForm from "./TopicForm";
import Dialog from "/imports/ui/client/components/Dialog";
import WatchButton from "/imports/ui/client/components/Button/WatchButton";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import DangerButton from "/imports/ui/client/components/Button/DangerButton";
import ReportButton from "/imports/ui/client/components/Button/ReportButton";
import ButtonGroup from "/imports/ui/client/components/Button/ButtonGroup";
import ActionWell from "/imports/ui/client/components/ActionWell";
import PrivacyIcon from "/imports/ui/client/components/Daikon/PrivacyIcon";
import Moment from "/imports/ui/client/components/Moment";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";
import Icon from "/imports/ui/client/components/Daikon/Icon";

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return { showForm: false };
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
        <ReportButton />
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
    if (this.data.loading || ! this.data.topic) {
      return <DenseLoadingSpinner />;
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
    </section>;
  }
});

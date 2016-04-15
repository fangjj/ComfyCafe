import React from "react";

import Topics from "/imports/api/topics/collection";
import setTitle from "/imports/api/common/setTitle";

import TopicMoreMenu from "./TopicMoreMenu";
import MessageList from "./MessageList";
import WatchButton from "/imports/ui/client/components/Button/WatchButton";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var id = FlowRouter.getParam("topicId");
    var handle = Meteor.subscribe("topic", id);
    return {
      loading: ! handle.ready(),
      topic: Topics.findOne({ _id: id }),
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
  renderMoreMenu() {
    var isOwner = this.data.currentUser
      && this.data.currentUser._id === this.data.topic.owner._id;
    if (isOwner) {
      return <div className="topRight">
        <TopicMoreMenu
          topic={this.data.topic}
          currentUser={this.data.currentUser}
          redirect={true}
        />
      </div>;
    }
  },
  render() {
    if (this.data.loading || ! this.data.topic) {
      return <DenseLoadingSpinner />;
    }

    var topic = this.data.topic;

    var room = topic.room;
    var roomUrl = FlowRouter.path("room", {roomId: room._id});

    return <section className="msgList">
      <header>
        {this.renderMoreMenu()}
        <h2>{topic.name}</h2>
        <WatchButton
          topic={this.data.topic}
          currentUser={this.data.currentUser}
        />
      </header>
      <MessageList
        topic={this.data.topic}
        currentUser={this.data.currentUser}
        updateTitle={this.updateTitle}
      />
    </section>;
  }
});

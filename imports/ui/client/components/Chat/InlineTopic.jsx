import React from "react";

import Topics from "/imports/api/topics/collection";
import setTitle from "/imports/api/common/setTitle";
import MessageList from "/imports/ui/client/components/Chat/MessageList";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const id = this.props.topicId;
    const handle = Meteor.subscribe("topicId", id);
    return {
      loading: ! handle.ready(),
      topic: Topics.findOne({ _id: id })
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
  render() {
    if (this.data.loading) {
      return <InlineLoadingSpinner />;
    }

    return <MessageList
      topic={this.data.topic}
      currentUser={this.props.currentUser}
      updateTitle={this.updateTitle}
      comments={true}
    />;
  }
});

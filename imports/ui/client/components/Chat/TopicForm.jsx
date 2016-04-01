import React from "react";

import "/imports/api/topics/methods";

import TopicDialog from "./TopicDialog";

const TopicForm = React.createClass({
  handleSubmit(data) {
    Meteor.call("addTopic", this.props.room._id, data, (err, topicId) => {
      this.props.handleClose();
      var path = FlowRouter.path("topic", {
        roomId: this.props.room._id,
        topicId: topicId
      });
      FlowRouter.go(path);
    });
  },
  render() {
    return <TopicDialog
      title="Create Topic"
      open={this.props.open}
      modal={false}
      handleClose={this.props.handleClose}
      handleSubmit={this.handleSubmit}
    />;
  }
});

export default TopicForm;

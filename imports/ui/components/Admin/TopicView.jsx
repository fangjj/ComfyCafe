import React from "react";

import DenseContent from "/imports/ui/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import Err404 from "/imports/ui/components/Err404";
import TopicForm from "/imports/ui/components/Chat/TopicForm";

export default React.createClass({
  render() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    const topic = this.props.topic;
    if (! topic) {
      return <Err404 />;
    }

    const url = FlowRouter.path("topic", {
      roomSlug: topic.room.slug,
      topicSlug: topic.slug
    });
    const roomUrl = FlowRouter.path("room", { roomSlug: topic.room.slug });
    return <DenseContent>
      <header>
        <h2><a href={roomUrl}>{topic.room.name}</a>/<a href={url}>{topic.name}</a></h2>
      </header>
      <TopicForm topic={topic} mod={true} actions={true} />
    </DenseContent>;
  }
});

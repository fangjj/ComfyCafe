import React from "react";

import DenseContent from "/imports/ui/client/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";
import Err404 from "/imports/ui/client/components/Err404";
import MessageForm from "/imports/ui/client/components/Chat/MessageForm";

export default React.createClass({
  render() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    const message = this.props.message;
    if (! message) {
      return <Err404 />;
    }

    const url = FlowRouter.path("message", {
      roomSlug: _.get(message, "topic.room.slug"),
      topicSlug: _.get(message, "topic.slug")
    }) + "#" + message._id;
    const ownerUrl = FlowRouter.path("profile", { username: message.owner.username });
    return <DenseContent>
      <header>
        <h2><a href={ownerUrl}>{message.owner.username}</a>/<a href={url}>{message._id}</a></h2>
      </header>
      <MessageForm message={message} mod={true} actions={true} />
    </DenseContent>;
  }
});

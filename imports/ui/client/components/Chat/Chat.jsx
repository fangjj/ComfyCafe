import React from "react";

import Room from "./Room";
import Topic from "./Topic";
import TopicList from "./TopicList";
import DenseLayout from "/imports/ui/client/components/DenseLayout";
import DenseCol from "/imports/ui/client/components/DenseCol";

const Chat = React.createClass({
  renderMain() {
    if (FlowRouter.getParam("topicId")) {
      return <Topic />;
    }
    return <Room />;
  },
  render() {
    return <DenseLayout>
      <DenseCol className="leftCol">
        <TopicList />
      </DenseCol>

      <DenseCol className="mainCol">
        {this.renderMain()}
      </DenseCol>
    </DenseLayout>;
  }
});

export default Chat;

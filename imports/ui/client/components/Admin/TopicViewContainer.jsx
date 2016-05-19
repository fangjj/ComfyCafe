import { createContainer } from "meteor/react-meteor-data";

import Topics from "/imports/api/topics/collection";
import TopicView from "./TopicView";

export default createContainer(({ params }) => {
  const topicId = FlowRouter.getParam("id");
  const handle = Meteor.subscribe("modTopic", topicId);
  return {
    loading: ! handle.ready(),
    topic: Topics.findOne({ _id: topicId })
  };
}, TopicView);

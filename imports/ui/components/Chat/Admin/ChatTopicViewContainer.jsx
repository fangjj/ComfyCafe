import { createContainer } from "meteor/react-meteor-data";

import Topics from "/imports/api/topics/collection";
import TopicView from "/imports/ui/components/Admin/TopicView";

export default createContainer(({ params }) => {
  const slug = FlowRouter.getParam("roomSlug");
  const topicId = FlowRouter.getParam("id");
  const handle = Meteor.subscribe("communityModTopic", slug, topicId);
  return {
    loading: ! handle.ready(),
    topic: Topics.findOne({ _id: topicId })
  };
}, TopicView);

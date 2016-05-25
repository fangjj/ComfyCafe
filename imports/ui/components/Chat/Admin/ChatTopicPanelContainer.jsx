import { createContainer } from "meteor/react-meteor-data";

import Topics from "/imports/api/topics/collection";
import ChatTopicPanel from "./ChatTopicPanel";

export default createContainer(({ params }) => {
  const slug = FlowRouter.getParam("roomSlug");
  const handle = Meteor.subscribe("communityModAllTopics", slug);
  return {
    loading: ! handle.ready(),
    topics: Topics.find(
      { "room.slug": slug },
      { sort: { createdAt: -1, name: 1 } }
    ).fetch()
  };
}, ChatTopicPanel);

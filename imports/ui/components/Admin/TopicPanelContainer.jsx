import { createContainer } from "meteor/react-meteor-data";

import Topics from "/imports/api/topics/collection";
import TopicPanel from "./TopicPanel";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("modAllTopics");
  return {
    loading: ! handle.ready(),
    topics: Topics.find(
      {},
      { sort: { createdAt: -1, name: 1 } }
    ).fetch()
  };
}, TopicPanel);

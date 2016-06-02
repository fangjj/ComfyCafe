import { createContainer } from "meteor/react-meteor-data";

import TagHistory from "/imports/api/tags/history/collection";
import TagHistoryCmp from "./TagHistory";

export default createContainer(({ params }) => {
  const tagId = FlowRouter.getParam("tagId");
  const handle = Meteor.subscribe("tagHistory", tagId);
  return {
    loading: ! handle.ready(),
    history: TagHistory.find(
      { tagId },
      { sort: { createdAt: -1, name: 1 } }
    ).fetch()
  };
}, TagHistoryCmp);

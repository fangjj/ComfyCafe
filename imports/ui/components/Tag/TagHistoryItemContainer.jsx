import { createContainer } from "meteor/react-meteor-data";

import TagHistory from "/imports/api/tags/history/collection";
import TagHistoryItem from "./TagHistoryItem";

export default createContainer(({ params }) => {
  const id = FlowRouter.getParam("id");
  const handle = Meteor.subscribe("tagHistoryItem", id);
  return {
    loading: ! handle.ready(),
    tag: TagHistory.findOne({ _id: id })
  };
}, TagHistoryItem);

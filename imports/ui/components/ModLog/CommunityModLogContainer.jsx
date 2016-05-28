import { createContainer } from "meteor/react-meteor-data";

import ModLog from "/imports/api/modlog/collection";
import ModLogCmp from "./ModLog";

export default createContainer(({ params }) => {
  const slug = FlowRouter.getParam("roomSlug");
  const handle = Meteor.subscribe("communityModlog", slug);
  return {
    loading: ! handle.ready(),
    modlog: ModLog.find({ "community.slug": slug }, { sort: { createdAt: -1 } }).fetch()
  };
}, ModLogCmp);

import { createContainer } from "meteor/react-meteor-data";

import ModLog from "/imports/api/modlog/collection";
import ModLogCmp from "./ModLog";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("modlog");
  return {
    loading: ! handle.ready(),
    modlog: ModLog.find({}, { sort: { createdAt: -1 } }).fetch()
  };
}, ModLogCmp);

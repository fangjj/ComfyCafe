import { createContainer } from "meteor/react-meteor-data";

import Rooms from "/imports/api/rooms/collection";
import CommunityView from "./CommunityView";

export default createContainer(({ params }) => {
  const communityId = FlowRouter.getParam("id");
  const handle = Meteor.subscribe("modCommunity", communityId);
  return {
    loading: ! handle.ready(),
    community: Rooms.findOne({ _id: communityId })
  };
}, CommunityView);

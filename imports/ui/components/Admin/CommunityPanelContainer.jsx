import { createContainer } from "meteor/react-meteor-data";

import Rooms from "/imports/api/rooms/collection";
import CommunityPanel from "./CommunityPanel";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("modAllCommunities");
  return {
    loading: ! handle.ready(),
    communities: Rooms.find(
      {},
      { sort: { createdAt: -1, name: 1 } }
    ).fetch()
  };
}, CommunityPanel);

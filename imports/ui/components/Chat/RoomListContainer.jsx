import { createContainer } from "meteor/react-meteor-data";

import Rooms from "/imports/api/rooms/collection";
import RoomList from "./RoomList";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("allRooms");
  return {
    loading: ! handle.ready(),
    rooms: Rooms.find(
      { system: { $ne: true } },
      { sort: { lastActivity: -1, createdAt: -1 } }
    ).fetch()
  };
}, RoomList);

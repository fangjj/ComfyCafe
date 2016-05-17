import React from "react";

import Rooms from "/imports/api/rooms/collection";
import RoomListItem from "/imports/ui/client/components/Chat/RoomListItem";
import RoomFAB from "/imports/ui/client/components/Chat/RoomFAB";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import Content from "/imports/ui/client/components/Content";
import List from "/imports/ui/client/components/List";

function renderRooms(rooms) {
  if (rooms.length) {
    return rooms.map((room) => {
      return <RoomListItem room={room} key={room._id} />;
    });
  }
  return <li>No rooms.</li>;
}

export default (props) => {
  if (props.loading) {
    return <LoadingSpinner />;
  }

  return <Content>
    <List>
      {renderRooms(props.rooms)}
    </List>
    <RoomFAB />
  </Content>;
};

import React from "react";
import NoSSR from "react-no-ssr";
import pluralize from "pluralize";
import Avatar from "material-ui/Avatar";

import RoomMoreMenu from "/imports/ui/client/components/Chat/RoomMoreMenu";
import Moment from "/imports/ui/client/components/Moment";

export default (props) => {
  const room = props.room;
  const url = FlowRouter.path("room", { roomSlug: room.slug });

  return <li className="roomListItem">
    <div className="flexLayout">
      <div className="leftSide">
        <a href={url}>
          <Avatar size={81}>{room.name[0]}</Avatar>
        </a>
      </div>
      <div className="rightSide">
        <div className="top">
          <div className="info">
            <a href={url}>{room.name}</a>
            <br />
            {room.topicCount + " " + pluralize("topic", room.topicCount)}
            <br />
            (last activity <Moment time={room.lastActivity} />)
          </div>
          <NoSSR>
            <RoomMoreMenu room={room} />
          </NoSSR>
        </div>
      </div>
    </div>
  </li>;
};

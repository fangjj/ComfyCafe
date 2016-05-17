import React from "react";
import pluralize from "pluralize";
import Avatar from "material-ui/Avatar";

import RoomMoreMenu from "/imports/ui/client/components/Chat/RoomMoreMenu";
import Moment from "/imports/ui/client/components/Moment";

export default React.createClass({
  renderMoreMenu() {
    const isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.room.owner._id;
    if (isOwner) {
      return <RoomMoreMenu room={this.props.room} currentUser={this.props.currentUser} />;
    }
  },
  render() {
    const room = this.props.room;
    const path = FlowRouter.path("room", { roomSlug: room.slug });

    return <li className="roomListItem">
      <div className="flexLayout">
        <div className="leftSide">
          <a href={path}>
            <Avatar size={81}>{room.name[0]}</Avatar>
          </a>
        </div>
        <div className="rightSide">
          <div className="top">
            <div className="info">
              <a href={path}>{room.name}</a>
              <br />
              {room.topicCount + " " + pluralize("topic", this.props.room.topicCount)}
              <br />
              (last activity <Moment time={room.lastActivity} />)
            </div>
            {this.renderMoreMenu()}
          </div>
        </div>
      </div>
    </li>;
  }
});

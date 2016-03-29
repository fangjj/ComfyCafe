import React from "react";

import {
  Avatar
} from "material-ui";

RoomListItem = React.createClass({
  renderMoreMenu() {
    var isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.room.owner._id;
    if (isOwner) {
      return <RoomMoreMenu room={this.props.room} currentUser={this.props.currentUser} />;
    }
  },
  renderCountLabel() {
    if (this.props.room.topicCount !== 1) {
      return "topics";
    } else {
      return "topic";
    }
  },
  render() {
    const room = this.props.room;
    const path = FlowRouter.path("room", {roomId: room._id});

    return <li className="roomListItem">
      <div className="flexLayout">
        <div className="leftSIde">
          <a href={path}>
            <Avatar size={81}>{room.name[0]}</Avatar>
          </a>
        </div>
        <div className="rightSide">
          <div className="top">
            <div className="info">
              <VisibilityLink
                href={path}
                visibility={room.visibility}
              >{room.name}</VisibilityLink>
              <br />
              {room.topicCount + " " + this.renderCountLabel()}
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

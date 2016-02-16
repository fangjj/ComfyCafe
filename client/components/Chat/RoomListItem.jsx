let {
  Avatar
} = mui;

RoomListItem = React.createClass({
  render() {
    var room = this.props.room;

    var path = FlowRouter.path("room", {roomId: room._id});

    var isoDate = moment(room.lastActivity).toISOString();
    var prettyDate = moment(room.lastActivity).fromNow();

    return <li>
      <div className="flexLayout">
        <div className="leftSIde">
          <a href={path}>
            <Avatar size={81}>{room.name[0]}</Avatar>
          </a>
        </div>
        <div className="rightSide">
          <div className="top">
            <div className="info">
              <a href={path}>{room.name}</a>
              <br />
              (last activity <time dateTime={isoDate}>{prettyDate}</time>)
            </div>
          </div>
        </div>
      </div>
    </li>;
  }
});

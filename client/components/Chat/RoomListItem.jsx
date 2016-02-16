RoomListItem = React.createClass({
  render() {
    var room = this.props.room;

    var path = FlowRouter.path("room", {roomId: room._id});

    var isoDate = moment(room.lastActivity).toISOString();
    var prettyDate = moment(room.lastActivity).fromNow();

    return <li className="room">
      <a href={path}>{room.name}</a>
      &nbsp;| (last activity <time dateTime={isoDate}>{prettyDate}</time>)
    </li>;
  }
});

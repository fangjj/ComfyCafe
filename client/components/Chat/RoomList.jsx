RoomList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("allRooms");
    return {
      loading: ! handle.ready(),
      rooms: Rooms.find(
        {
          system: { $ne: true },
          $or: [
            { visibility: { $ne: "unlisted" } },
            { "owner._id": Meteor.userId() }
          ]
        },
        { sort: { lastActivity: -1, createdAt: -1 } }
      ).fetch(),
      currentUser: Meteor.user()
    };
  },
  renderRooms() {
    if (this.data.rooms.length) {
      return this.data.rooms.map((room) => {
        return <RoomListItem room={room} currentUser={this.data.currentUser} key={room._id} />;
      });
    }
    return <li>No rooms.</li>;
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinner />;
    }

    return <div className="content">
      <ul className="list">
        {this.renderRooms()}
      </ul>
      <RoomFAB />
    </div>;
  }
});

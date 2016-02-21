Room = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var id = FlowRouter.getParam("roomId");
    var handle = Meteor.subscribe("room", id);
    return {
      loading: ! handle.ready(),
      room: Rooms.findOne({ _id: id }),
      currentUser: Meteor.user()
    };
  },
  renderMoreMenu() {
    var isOwner = this.data.currentUser
      && this.data.currentUser._id === this.data.room.owner._id;
    if (isOwner) {
      return <div className="topRight">
        <RoomMoreMenu
          room={this.data.room}
          currentUser={this.data.currentUser}
          redirect={true}
        />
      </div>;
    }
  },
  renderFAB() {
    if (this.data.currentUser) {
      return <TopicFAB room={this.data.room} />;
    }
  },
  render() {
    if (this.data.loading || ! this.data.room) {
      return <LoadingSpinnerComponent />;
    }

    var room = this.data.room;

    setTitle(room.name);

    return <section className="content">
      <header>
        {this.renderMoreMenu()}
        <h2>{room.name}</h2>
      </header>
      <TopicList />
      {this.renderFAB()}
    </section>;
  }
});

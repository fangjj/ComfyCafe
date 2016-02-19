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
  renderFAB() {
    if (this.data.currentUser) {
      return <TopicFAB room={this.data.room} />;
    }
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    var room = this.data.room;

    setTitle(room.name);

    return <section className="roomView content">
      <header>
        <h2>{room.name}</h2>
      </header>
      <TopicList />
      {this.renderFAB()}
    </section>;
  }
});

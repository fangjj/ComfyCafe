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

    setTitle(this.data.room.name);

    return <div className="roomView">
      {this.data.room.name}
      <TopicList />
      {this.renderFAB()}
    </div>;
  }
});

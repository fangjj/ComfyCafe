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

    return <div className="roomView">
      {this.data.room.name}
      <TopicList topics={this.data.room.topics} currentUser={this.data.currentUser} />
      {this.renderFAB()}
    </div>;
  }
});

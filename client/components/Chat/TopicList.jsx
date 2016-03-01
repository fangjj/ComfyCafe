let {
  TextField,
  FlatButton,
  FontIcon
} = mui;

TopicList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var id = FlowRouter.getParam("roomId");
    var handleRoom = Meteor.subscribe("room", id);
    var handleTopics = Meteor.subscribe("roomTopics", id);
    return {
      loading: ! handleRoom.ready() || ! handleTopics.ready(),
      room: Rooms.findOne({ _id: id }),
      topics: Topics.find(
        { "room._id": id },
        { sort: { lastActivity: -1, createdAt: -1 } }
      ).fetch(),
      currentUser: Meteor.user()
    };
  },
  renderTopics() {
    if (this.data.topics.length) {
      return this.data.topics.map((topic) => {
        return <TopicListItem topic={topic} currentUser={this.data.currentUser} key={topic._id} />;
      });
    }
    return <li>No topics.</li>;
  },
  render() {
    if (this.data.loading) {
      return <InlineLoadingSpinner />;
    }

    return <ol className="list">
      <li className="roomTools">
        {/*<TextField
          hintText="Search"
          fullWidth={true}
        />*/}
        <TopicFlatButton room={this.data.room} />
        <RoomMoreMenu room={this.data.room} />
      </li>
      {this.renderTopics()}
    </ol>;
  }
});

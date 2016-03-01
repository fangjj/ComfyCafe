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
      return <DenseLoadingSpinner />;
    }

    return <ol className="list">
      <li className="roomHead">
        <a href={FlowRouter.path("room", {roomId: this.data.room._id})}>
          <header>
            <h2>{this.data.room.name}</h2>
          </header>
        </a>
      </li>
      <li className="roomTools">
        <TopicButton room={this.data.room} />
        <TextField
          hintText="Search"
          fullWidth={true}
        />
      </li>
      {this.renderTopics()}
    </ol>;
  }
});

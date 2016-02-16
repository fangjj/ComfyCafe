TopicList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var id = FlowRouter.getParam("roomId");
    var handle = Meteor.subscribe("roomTopics", id);
    return {
      loading: ! handle.ready(),
      topics: Topics.find({ "room._id": id }).fetch(),
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
    return <ol className="topics">
      {this.renderTopics()}
    </ol>;
  }
});

Topic = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var id = FlowRouter.getParam("topicId");
    var handle = Meteor.subscribe("topic", id);
    return {
      loading: ! handle.ready(),
      topic: Topics.findOne({ _id: id }),
      currentUser: Meteor.user()
    };
  },
  renderFAB() {
    if (this.data.currentUser) {
      return <MessageFAB topic={this.data.topic} />;
    }
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    var topic = this.data.topic;

    setTitle(topic.name);

    var room = topic.room;
    var roomUrl = FlowRouter.path("room", {roomId: room._id});

    return <section className="msgList content">
      <header>
        <h2>{topic.name}</h2>
        <a className="subtitle" href={roomUrl}>{room.name}</a>
      </header>
      <MessageList messages={this.data.topic.messages} currentUser={this.data.currentUser} />
      {this.renderFAB()}
    </section>;
  }
});

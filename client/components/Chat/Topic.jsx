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
  renderMoreMenu() {
    var isOwner = this.data.currentUser
      && this.data.currentUser._id === this.data.topic.owner._id;
    if (isOwner) {
      return <div className="topRight">
        <TopicMoreMenu
          topic={this.data.topic}
          currentUser={this.data.currentUser}
          redirect={true}
        />
      </div>;
    }
  },
  render() {
    if (this.data.loading || ! this.data.topic) {
      return <LoadingSpinnerComponent />;
    }

    var topic = this.data.topic;

    setTitle(topic.name);

    var room = topic.room;
    var roomUrl = FlowRouter.path("room", {roomId: room._id});

    return <section className="msgList content">
      <header>
        {this.renderMoreMenu()}
        <h2>{topic.name}</h2>
        <a className="subtitle" href={roomUrl}>{room.name}</a>
      </header>
      <MessageList
        topic={this.data.topic}
        messages={this.data.topic.messages}
        currentUser={this.data.currentUser}
      />
    </section>;
  }
});

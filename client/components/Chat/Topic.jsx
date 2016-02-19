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
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    setTitle(this.data.topic.name);

    return <div className="msgList content">
      <MessageList messages={this.data.topic.messages} currentUser={this.data.currentUser} />
      <MessageFAB topic={this.data.topic} />
    </div>;
  }
});

MessageList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var id = FlowRouter.getParam("topicId");
    var handle = Meteor.subscribe("topicMessages", id);
    return {
      loading: ! handle.ready(),
      messages: Messages.find(
        { "topic._id": id },
        { sort: { createdAt: -1, name: 1 } }
      ).fetch(),
      currentUser: Meteor.user()
    };
  },
  renderMsg() {
    if (this.data.messages.length) {
      return this.data.messages.map((msg) => {
        return <MessageListItem message={msg} currentUser={this.props.currentUser} key={msg._id} />;
      });
    }
    return <li>No messages.</li>;
  },
  render() {
    return <ol className="list">
      {this.renderMsg()}
    </ol>;
  }
});

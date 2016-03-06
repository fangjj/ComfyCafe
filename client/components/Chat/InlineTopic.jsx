InlineTopic = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const id = this.props.topicId;
    let handle = Meteor.subscribe("topic", id);
    return {
      loading: ! handle.ready(),
      topic: Topics.findOne({ _id: id })
    };
  },
  render() {
    if (this.data.loading) {
      return <InlineLoadingSpinner />;
    }

    return <MessageList
      topic={this.data.topic}
      currentUser={this.props.currentUser}
      updateTitle={() => {}}
    />;
  }
});

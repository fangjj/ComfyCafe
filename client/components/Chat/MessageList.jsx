MessageList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var id = FlowRouter.getParam("topicId");
    var handle = Meteor.subscribe("topicMessages", id);
    return {
      loading: ! handle.ready(),
      messages: Messages.find(
        { "topic._id": id },
        { sort: { createdAt: 1 } }
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
  renderTyping() {
    if (this.props.topic.typing) {
      var typing = _.filter(this.props.topic.typing, (x) => {
        return x._id !== this.props.currentUser._id;
      });
      if (typing.length) {
        let verb = "is";
        if (typing.length > 1) {
          verb = "are";
        }
        return <li>
          {fancyCommaJoin(typing, (x) => {
            return x.profile.displayName || x.username;
          })} {verb} typing...
        </li>;
      }
    }
  },
  renderInput() {
    if (this.props.currentUser) {
      return <li>
        <MessageInlineForm
          topic={this.props.topic}
        />
      </li>;
    }
  },
  render() {
    if (this.data.loading) {
      return <InlineLoadingSpinner />;
    }

    return <ol className="list">
      {this.renderMsg()}
      {this.renderTyping()}
      {this.renderInput()}
    </ol>;
  }
});

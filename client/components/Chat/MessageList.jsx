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
  getInitialState() {
    return {
      initialCount: 0,
      difference: 0
    };
  },
  componentWillReceiveProps() {
    let initialCount = this.state.initialCount;
    if (initialCount === 0) {
      initialCount = this.data.messages.length;
      this.setState({
        initialCount: initialCount
      });
    }

    const difference = Math.max(this.data.messages.length - initialCount, 0);
    this.setState({
      difference: difference
    });
  },
  decrementDifference() {
    this.setState({
      initialCount: this.state.initialCount + 1,
      difference: this.state.difference - 1
    });
  },
  clearDifference() {
    if (this.state.difference) {
      this.setState({
        initialCount: this.data.messages.length,
        difference: 0
      });
    }

    // Clear notifications
    Meteor.call("viewTopic", this.props.topic._id);
  },
  componentDidMount() {
    window.addEventListener("focus", this.clearDifference);
  },
  componentWillUnmount() {
    window.removeEventListener("focus", this.clearDifference);
  },
  renderMsg() {
    if (this.data.messages.length) {
      return this.data.messages.map((msg) => {
        return <MessageListItem
          message={msg}
          currentUser={this.props.currentUser}
          key={msg._id}
          onVisible={this.decrementDifference}
        />;
      });
    }
    return <li>No messages.</li>;
  },
  renderTyping() {
    if (this.props.topic.typing) {
      var typing = _.filter(this.props.topic.typing, (x) => {
        if (! this.props.currentUser) {
          return true;
        }
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
          })} {verb} typing<EllipsisAnimation />
        </li>;
      }
    }
  },
  renderInput() {
    if (this.props.currentUser) {
      return <li>
        <MessageInlineForm
          topic={this.props.topic}
          afterSubmit={this.decrementDifference}
        />
      </li>;
    }
  },
  render() {
    if (this.data.loading) {
      return <InlineLoadingSpinner />;
    }

    this.props.updateTitle(this.state.difference);

    return <ol className="list">
      {this.renderMsg()}
      {this.renderTyping()}
      {this.renderInput()}
    </ol>;
  }
});

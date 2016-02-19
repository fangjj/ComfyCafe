MessageList = React.createClass({
  renderMsg() {
    if (this.props.messages) {
      return this.props.messages.map((msg) => {
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

TopicList = React.createClass({
  renderTopics() {
    if (this.props.topics) {
      return this.props.topics.map((topic) => {
        return <TopicListItem topic={topic} currentUser={this.props.currentUser} key={topic._id} />;
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

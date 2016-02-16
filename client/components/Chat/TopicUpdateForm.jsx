TopicUpdateForm = React.createClass({
  handleSubmit(data) {
    Meteor.call("updateTopic", this.props.room._id, this.props.topic._id, data, (err) => {
      this.props.handleClose();
    });
  },
  render() {
    return <TopicDialog
      title="Edit Topic"
      open={this.props.open}
      modal={false}
      handleClose={this.props.handleClose}
      handleSubmit={this.handleSubmit}
      topic={this.props.topic}
    />;
  }
});

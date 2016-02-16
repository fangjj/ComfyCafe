TopicForm = React.createClass({
  handleSubmit(data) {
    Meteor.call("addTopic", this.props.room._id, data, (err, name) => {
      this.props.handleClose();
    });
  },
  render() {
    return <TopicDialog
      title="Create Topic"
      open={this.props.open}
      modal={false}
      handleClose={this.props.handleClose}
      handleSubmit={this.handleSubmit}
    />;
  }
});

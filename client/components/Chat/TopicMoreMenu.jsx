let {
  IconMenu,
  MenuItem,
  IconButton,
  FontIcon
} = mui;

TopicMoreMenu = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showTopicForm() {
    this.setState({showForm: true});
  },
  hideTopicForm() {
    this.setState({showForm: false});
  },
  delete() {
    Meteor.call("deleteTopic", this.props.topic._id);
  },
  render() {
    var topic = this.props.topic;

    var owner = topic.owner;
    var isOwner = this.props.currentUser && this.props.currentUser._id === owner._id;

    var moreBtn = <IconButton>
      <FontIcon className="material-icons">more_horiz</FontIcon>
    </IconButton>;

    return <div className="more">
      <IconMenu
        iconButtonElement={moreBtn}
        anchorOrigin={{horizontal: "right", vertical: "top"}}
        targetOrigin={{horizontal: "right", vertical: "top"}}
      >
        <MenuItem primaryText="Edit" onTouchTap={this.showTopicForm} />
        <MenuItem primaryText="Delete" onTouchTap={this.delete} />
      </IconMenu>
      <TopicUpdateForm
        topic={this.props.topic}
        handleClose={this.hideTopicForm}
        open={this.state.showForm}
      />
    </div>;
  }
});

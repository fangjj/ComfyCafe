let {
  IconMenu,
  MenuItem,
  IconButton,
  FontIcon
} = mui;

PostMoreMenu = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showPostForm() {
    this.setState({showForm: true});
  },
  hidePostForm() {
    this.setState({showForm: false});
  },
  reroll() {
    Meteor.call("rerollPost", this.props.post._id);
  },
  delete() {
    Meteor.call("deletePost", this.props.post._id);
  },
  render() {
    var post = this.props.post;

    var owner = post.owner;
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
        <MenuItem primaryText="Edit" onTouchTap={this.showPostForm} />
        <MenuItem primaryText="Reroll" onTouchTap={this.reroll} />
        <MenuItem primaryText="Delete" onTouchTap={this.delete} />
      </IconMenu>
      <PostUpdateForm
        post={this.props.post}
        handleClose={this.hidePostForm}
        open={this.state.showForm}
      />
    </div>;
  }
});

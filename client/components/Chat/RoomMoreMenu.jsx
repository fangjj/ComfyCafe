let {
  IconMenu,
  MenuItem,
  IconButton,
  FontIcon
} = mui;

RoomMoreMenu = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showRoomForm() {
    this.setState({showForm: true});
  },
  hideRoomForm() {
    this.setState({showForm: false});
  },
  delete() {
    Meteor.call("deleteRoom", this.props.room._id, () => {
      if (this.props.redirect) {
        var path = FlowRouter.path("roomList");
        FlowRouter.go(path);
      }
    });
  },
  render() {
    var room = this.props.room;

    var owner = room.owner;
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
        <MenuItem primaryText="Edit" onTouchTap={this.showRoomForm} />
        <MenuItem primaryText="Delete" onTouchTap={this.delete} />
      </IconMenu>
      <RoomUpdateForm
        room={this.props.room}
        handleClose={this.hideRoomForm}
        open={this.state.showForm}
      />
    </div>;
  }
});
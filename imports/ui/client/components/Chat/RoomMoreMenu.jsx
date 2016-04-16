import React from "react";
import {
  IconMenu,
  MenuItem,
  IconButton
} from "material-ui";

import "/imports/api/rooms/methods";
import RoomForm from "./RoomForm";
import Dialog from "/imports/ui/client/components/Dialog";
import Icon from "/imports/ui/client/components/Daikon/Icon";

export default React.createClass({
  getInitialState() {
    return { showForm: false };
  },
  showRoomForm() {
    this.setState({ showForm: true });
  },
  hideRoomForm() {
    this.setState({ showForm: false });
  },
  delete() {
    Meteor.call("deleteRoom", this.props.room._id, () => {
      if (this.props.redirect) {
        const path = FlowRouter.path("roomList");
        FlowRouter.go(path);
      }
    });
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Edit Room"
        formId={"form" + this.props.room._id}
        open={true}
        onClose={this.hideRoomForm}
      >
        <RoomForm
          id={"form" + this.props.room._id}
          room={this.props.room}
          onClose={this.hideRoomForm}
        />
      </Dialog>;
    }
  },
  render() {
    const room = this.props.room;

    const owner = room.owner;
    const isOwner = this.props.currentUser && this.props.currentUser._id === owner._id;

    const moreBtn = <IconButton>
      <Icon>more_horiz</Icon>
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
      {this.renderForm()}
    </div>;
  }
});

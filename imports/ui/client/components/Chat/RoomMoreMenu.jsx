import React from "react";
import MenuItem from "material-ui/MenuItem";

import "/imports/api/rooms/methods";
import RoomForm from "/imports/ui/client/components/Chat/RoomForm";
import DialogForm from "/imports/ui/client/components/DialogForm";
import MoreMenu from "/imports/ui/client/components/MoreMenu";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    return { showForm: false };
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
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
      return <DialogForm
        title="Edit Community"
        id={"form" + this.props.room._id}
        form={<RoomForm room={this.props.room} redirect={this.props.redirect} />}
        onClose={this.hideForm}
      />;
    }
  },
  render() {
    const room = this.props.room;

    const owner = room.owner;
    const isOwner = this.context.currentUser && this.context.currentUser._id === owner._id;

    if (! isOwner) {
      return null;
    }

    return <MoreMenu form={this.renderForm()}>
      <MenuItem primaryText="Edit" onTouchTap={this.showForm} />
      <MenuItem primaryText="Delete" onTouchTap={this.delete} />
    </MoreMenu>;
  }
});

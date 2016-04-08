import React from "react";

import RoomForm from "./RoomForm";
import FAB from "/imports/ui/client/components/FAB";

export default React.createClass({
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
  render() {
    return <FAB iconName="add" onTouchTap={this.showRoomForm}>
      <RoomForm
        handleClose={this.hideRoomForm}
        open={this.state.showForm}
      />
    </FAB>;
  }
});

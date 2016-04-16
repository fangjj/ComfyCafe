import React from "react";

import RoomForm from "./RoomForm";
import Dialog from "/imports/ui/client/components/Dialog";
import FAB from "/imports/ui/client/components/FAB";

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
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Create Room"
        formId="formNewRoom"
        open={true}
        onClose={this.hideRoomForm}
      >
        <RoomForm
          id="formNewRoom"
          onClose={this.hideRoomForm}
        />
      </Dialog>;
    }
  },
  render() {
    return <FAB iconName="add" onTouchTap={this.showRoomForm}>
      {this.renderForm()}
    </FAB>;
  }
});

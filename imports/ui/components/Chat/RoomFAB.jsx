import React from "react";

import RoomForm from "./RoomForm";
import DialogForm from "/imports/ui/components/DialogForm";
import FAB from "/imports/ui/components/FAB";

export default React.createClass({
  getInitialState() {
    return { showForm: false };
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
    this.setState({ showForm: false });
  },
  renderForm() {
    if (this.state.showForm) {
      return <DialogForm
        title="Create Community"
        id="formNewRoom"
        form={<RoomForm redirect={false} />}
        onClose={this.hideForm}
      />;
    }
  },
  render() {
    return <FAB iconName="add" onClick={this.showForm}>
      {this.renderForm()}
    </FAB>;
  }
});

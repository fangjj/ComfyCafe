import React from "react";

import RoomForm from "./RoomForm";
import Icon from "../Icon";

import {
  FloatingActionButton
} from "material-ui";

const RoomFAB = React.createClass({
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
    return <div className="fixed-action-btn">
      <FloatingActionButton secondary={true} onTouchTap={this.showRoomForm}>
        <Icon>add</Icon>
      </FloatingActionButton>
      <RoomForm
        handleClose={this.hideRoomForm}
        open={this.state.showForm}
      />
    </div>;
  }
});

export default RoomFAB;

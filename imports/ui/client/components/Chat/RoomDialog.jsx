import React from "react";

import generateRoom from "/imports/api/rooms/nameGen/generator";

import RoomInnerForm from "./RoomInnerForm";

import {
  Dialog,
  FlatButton,
  RaisedButton
} from "material-ui";

const defaultState = {
  name: generateRoom(),
  nameGenerated: true,
  visibility: "public"
};

const RoomDialog = React.createClass({
  getInitialState() {
    if (this.props.room) {
      return {
        name: this.props.room.name,
        nameGenerated: false,
        visibility: this.props.room.visibility
      };
    } else {
      return defaultState;
    }
  },
  handleName(event) {
    this.setState({
      name: event.target.value,
      nameGenerated: false
    });
  },
  handleVisibility(value) {
    this.setState({visibility: value});
  },
  handleSubmit() {
    this.props.handleSubmit({
      name: this.state.name,
      visibility: this.state.visibility
    });

    if (! this.props.room) {
      this.setState(defaultState);
    }
  },
  componentWillReceiveProps() {
    if (this.state.nameGenerated) {
      this.setState({
        name: generateRoom()
      });
    }
  },
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        labelStyle={{fontSize: "18px"}}
        primary={true}
        onTouchTap={this.props.handleClose}
      />,
      <FlatButton
        label="Submit"
        labelStyle={{fontSize: "18px"}}
        secondary={true}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return <Dialog
      className="roomForm"
      title={this.props.title}
      actions={actions}
      modal={this.props.modal}
      open={this.props.open}
      autoScrollBodyContent={true}
      onRequestClose={this.props.handleClose}
    >
      <RoomInnerForm
        name={this.state.name}
        handleName={this.handleName}
        visibility={this.state.visibility}
        handleVisibility={this.handleVisibility}
      />
    </Dialog>;
  }
});

export default RoomDialog;

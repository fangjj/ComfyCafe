import React from "react";

import "/imports/api/rooms/methods";
import generateRoom from "/imports/api/rooms/nameGen/generator";
import Form from "/imports/ui/client/components/Form";
import VisibilitySelector from "/imports/ui/client/components/VisibilitySelector";
import TextField from "/imports/ui/client/components/TextField";
import TextArea from "/imports/ui/client/components/TextArea";

const defaultState = {
  name: generateRoom(),
  nameGenerated: true,
  visibility: "public",
  description: "",
  rules: ""
};

export default React.createClass({
  getInitialState() {
    if (this.props.room) {
      return {
        name: this.props.room.name,
        nameGenerated: false,
        visibility: this.props.room.visibility,
        description: this.props.room.description,
        rules: this.props.room.rules
      };
    } else {
      return defaultState;
    }
  },
  componentWillReceiveProps() {
    if (this.state.nameGenerated) {
      this.setState({ name: generateRoom() });
    }
  },
  handleName(e) {
    this.setState({
      name: e.target.value,
      nameGenerated: false
    });
  },
  handleVisibility(value) {
    this.setState({ visibility: value });
  },
  handleDescription(e) {
    this.setState({ description: e.target.value });
  },
  handleRules(e) {
    this.setState({ rules: e.target.value });
  },
  handleSubmit(e) {
    const data = {
      name: this.state.name,
      visibility: this.state.visibility,
      description: this.state.description,
      rules: this.state.rules
    };

    if (! this.props.room) {
      Meteor.call("addRoom", data, (err, roomId) => {
        if (err) {
          prettyPrint(err);
        } else {
          const path = FlowRouter.path("room", { roomId: roomId });
          FlowRouter.go(path);
        }
      });
    } else {
      Meteor.call("updateRoom", this.props.room._id, data, (err) => {
        if (err) {
          prettyPrint(err);
        }
      });
    }
  },
  render() {
    return <Form
      id={this.props.id}
      actions={this.props.actions}
      onSubmit={this.handleSubmit}
      onClose={this.props.onClose}
    >
      <TextField
        defaultValue={this.state.name}
        label="Name"
        onChange={this.handleName}
      />
      <VisibilitySelector
        visibility={this.state.visibility}
        onChange={this.handleVisibility}
      />
      <TextArea
        defaultValue={this.state.description}
        label="Description"
        rows={3}
        rowsMax={10}
        onChange={this.handleDescription}
      />
      <TextArea
        defaultValue={this.state.rules}
        label="Rules"
        rows={3}
        rowsMax={10}
        onChange={this.handleRules}
      />
    </Form>;
  }
});

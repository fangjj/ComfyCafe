import React from "react";

import generateTopic from "/imports/api/topics/nameGen/generator";

import TopicInnerForm from "./TopicUpdateForm";

import {
  Dialog,
  FlatButton
} from "material-ui";

const defaultState = {
  name: generateTopic(),
  nameGenerated: true,
  visibility: "public"
};

export default React.createClass({
  getInitialState() {
    if (this.props.topic) {
      return {
        name: this.props.topic.name,
        nameGenerated: false,
        visibility: this.props.topic.visibility
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

    if (! this.props.topic) {
      this.setState(defaultState);
    }
  },
  componentWillReceiveProps() {
    if (this.state.nameGenerated) {
      this.setState({
        name: generateTopic()
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
    console.log(this.props.open);

    return <Dialog
      className="topicForm"
      title={this.props.title}
      actions={actions}
      modal={this.props.modal}
      open={this.props.open}
      autoScrollBodyContent={true}
      onRequestClose={this.props.handleClose}
    >
      <TopicInnerForm
        name={this.state.name}
        handleName={this.handleName}
        visibility={this.state.visibility}
        handleVisibility={this.handleVisibility}
      />
    </Dialog>;
  }
});

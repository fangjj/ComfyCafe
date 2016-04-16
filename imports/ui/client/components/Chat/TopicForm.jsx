import React from "react";

import "/imports/api/topics/methods";
import generateTopic from "/imports/api/topics/nameGen/generator";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import VisibilitySelector from "/imports/ui/client/components/VisibilitySelector";

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
  componentWillReceiveProps() {
    if (this.state.nameGenerated) {
      this.setState({ name: generateTopic() });
    }
  },
  handleName(event) {
    this.setState({
      name: event.target.value,
      nameGenerated: false
    });
  },
  handleVisibility(value) {
    this.setState({ visibility: value });
  },
  handleSubmit(e) {
    const data = {
      name: this.state.name,
      visibility: this.state.visibility
    };

    if (! this.props.topic) {
      Meteor.call("addTopic", this.props.room._id, data, (err, topicId) => {
        if (err) {
          prettyPrint(err);
        } else {
          const path = FlowRouter.path("topic", {
            roomId: this.props.room._id,
            topicId: topicId
          });
          FlowRouter.go(path);
        }
      });
    } else {
      Meteor.call("updateTopic", this.props.topic._id, data, (err) => {
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
    </Form>;
  }
});

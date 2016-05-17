import React from "react";

import "/imports/api/topics/methods";
import generateTopic from "/imports/api/topics/nameGen/generator";
import { initialStateBuilder, dataBuilder } from "/imports/ui/client/utils/forms";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";

const defaultState = {
  name: generateTopic
};

export default React.createClass({
  getInitialState() {
    const state = initialStateBuilder(this.props.topic, defaultState);
    state.nameGenerated = ! this.props.topic;
    return state;
  },
  componentWillReceiveProps() {
    if (this.state.nameGenerated) {
      this.setState({ name: generateTopic() });
    }
  },
  handleName(e) {
    this.setState({
      name: e.target.value,
      nameGenerated: false
    });
  },
  handleSubmit(e) {
    const data = dataBuilder(this.state, defaultState);

    if (! this.props.topic) {
      Meteor.call("addTopic", this.props.room._id, data, false, (err, topicSlug) => {
        if (err) {
          prettyPrint(err);
        } else {
          const path = FlowRouter.path("topic", {
            roomSlug: this.props.room.slug,
            topicSlug: topicSlug
          });
          FlowRouter.go(path);
        }
      });
    } else {
      Meteor.call("updateTopic", this.props.topic._id, data, (err, topicSlug) => {
        if (err) {
          prettyPrint(err);
        } else {
          const path = FlowRouter.path("topic", {
            roomSlug: this.props.room.slug,
            topicSlug: topicSlug
          });
          FlowRouter.go(path);
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
    </Form>;
  }
});

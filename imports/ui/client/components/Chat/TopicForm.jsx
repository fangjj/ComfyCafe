import React from "react";
import TextField from "material-ui/TextField";

import "/imports/api/topics/methods";
import generateTopic from "/imports/api/topics/nameGen/generator";
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
    e.preventDefault();

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

    this.props.onClose();
  },
  render() {
    return <form id={this.props.id} onSubmit={this.handleSubmit}>
      <TextField
        defaultValue={this.state.name}
        floatingLabelText="Name"
        floatingLabelStyle={{ fontSize: "20px" }}
        onChange={this.handleName}
        fullWidth={true}
      />
      <VisibilitySelector
        visibility={this.state.visibility}
        onChange={this.handleVisibility}
      />
    </form>;
  }
});

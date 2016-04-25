import _ from "lodash";
import React from "react";

import "/imports/api/messages/methods";
import generateMessageHint from "/imports/api/messages/nameGen/hintGenerator";
import Form from "/imports/ui/client/components/Form";
import TextArea from "/imports/ui/client/components/TextArea";

const defaultState = {
  body: ""
};

export default React.createClass({
  getInitialState() {
    if (this.props.message) {
      return {
        body: this.props.message.body
      };
    } else {
      return defaultState;
    }
  },
  handleBody(e) {
    this.setState({ body: e.target.value });
  },
  handleSubmit() {
    const data = {
      body: this.state.body
    };

    if (! this.props.message) {
      Meteor.call("addMessage", this.props.topic._id, data, (err, name) => {
        if (err) {
          prettyPrint(err);
        }
      });
    } else {
      Meteor.call("updateMessage", this.props.message._id, data, (err) => {
        if (err) {
          prettyPrint(err);
        }
      });
    }
  },
  render() {
    const value = {};
    const body = _.get(this.props, "message.body");
    if (this.props.directValue) {
      value.value = body;
    } else {
      value.defaultValue = body;
    }
    return <Form
      className="messageInput"
      id={this.props.id}
      actions={this.props.actions}
      onSubmit={this.handleSubmit}
      onClose={this.props.onClose}
    >
      <TextArea
        {...value}
        hintText={generateMessageHint()}
        rows={3}
        rowsMax={10}
        onChange={this.handleBody}
      />
    </Form>;
  }
});

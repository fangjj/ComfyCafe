import React from "react";

import "/imports/api/messages/methods";
import "/imports/api/topics/methods";

import MessageInnerForm from "./MessageInnerForm";
import Actions from "../Actions";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

const MessageInlineForm = React.createClass({
  getInitialState() {
    return {
      typing: false,
      body: ""
    };
  },
  handleBody(event) {
    if (! this.state.typing) {
      Meteor.call("startTyping", this.props.topic._id);
    }
    this.setState({
      typing: true,
      body: event.target.value
    });
    if (! event.target.value) {
      this.setState({
        typing: false
      });
      Meteor.call("stopTyping", this.props.topic._id);
    }
  },
  handleSubmit(event) {
    Meteor.call("addMessage", this.props.topic._id, {
      body: this.state.body
    });
    this.setState({
      typing: false,
      body: ""
    });
    Meteor.call("stopTyping", this.props.topic._id);
    this.props.afterSubmit();
  },
  render() {
    return <div>
      <MessageInnerForm
        directValue={true}
        body={this.state.body}
        handleBody={this.handleBody}
      />
      <Actions>
        <SubmitButton
          label="Send"
          iconName="send"
          onTouchTap={this.handleSubmit}
        />
      </Actions>
    </div>;
  }
});

export default MessageInlineForm;

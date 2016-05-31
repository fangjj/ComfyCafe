import React from "react";

import "/imports/api/messages/methods";
import "/imports/api/topics/methods";
import MessageForm from "/imports/ui/components/Chat/MessageForm";
import Actions from "/imports/ui/components/Actions";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import BottomFAB from "/imports/ui/components/BottomFAB";

function getCursorPosition(el) {
  let pos = 0;
  if ("selectionStart" in el) {
    pos = el.selectionStart;
  } else if ("selection" in document) {
    el.focus();
    const Sel = document.selection.createRange();
    const SelLength = document.selection.createRange().text.length;
    Sel.moveStart('character', -el.value.length);
    pos = Sel.text.length - SelLength;
  }
  return pos;
}

export default React.createClass({
  getInitialState() {
    return {
      typing: false,
      body: ""
    };
  },
  keyHandler(e) {
    const isEnter = e.which === 13;
    const isShifted = e.shiftKey;
    const ENTER = 13;
    if (isEnter && ! isShifted) {
      const pos = getCursorPosition(e.target);
      const end = e.target.value.length;
      if (pos === end) {
        e.preventDefault();
        this.handleSubmit();
      }
    }
  },
  componentDidMount() {
    this.refs.form.addEventListener("keydown", this.keyHandler);
  },
  componentWillUnmount() {
    this.refs.form.removeEventListener("keydown", this.keyHandler);
  },
  toBottom() {
    this.refs.form.scrollIntoView({ block: "end", behavior: "smooth" });
  },
  handleBody(e) {
    if (! this.state.typing) {
      Meteor.call("startTyping", this.props.topic._id);
    }
    this.setState({
      typing: true,
      body: e.target.value
    });
    if (! e.target.value) {
      this.setState({ typing: false });
      Meteor.call("stopTyping", this.props.topic._id);
    }
  },
  handleSubmit() {
    if (! this.state.body) {
      return;
    }
    if (! this.props.dmWith) {
      Meteor.call("addMessage", this.props.topic._id, { body: this.state.body });
    } else {
      Meteor.call("addDirectMessage", this.props.dmWith, { body: this.state.body });
    }
    this.setState({
      typing: false,
      body: ""
    });
    Meteor.call("stopTyping", this.props.topic._id);
    this.props.afterSubmit();
  },
  renderBottomFAB() {
    if (! this.props.comments) {
      return <BottomFAB onTouchTap={this.toBottom} />
    }
  },
  render() {
    const left = <SubmitButton
      label="Send"
      iconName="send"
      onTouchTap={this.handleSubmit}
    />;
    return <div ref="form">
      <MessageForm
        directValue={true}
        body={this.state.body}
        handleBody={this.handleBody}
        topic={this.props.topic}
        dmWith={this.props.dmWith}
      />
      <Actions left={left} />
      {this.renderBottomFAB()}
    </div>;
  }
});

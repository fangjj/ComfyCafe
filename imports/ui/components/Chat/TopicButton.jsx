import React from "react";

import TopicForm from "/imports/ui/components/Chat/TopicForm";
import ConvoForm from "/imports/ui/components/Chat/ConvoForm";
import DialogForm from "/imports/ui/components/DialogForm";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";

export default React.createClass({
  getInitialState() {
    return { showForm: false };
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
    this.setState({ showForm: false });
  },
  renderForm() {
    if (this.state.showForm) {
      if (! this.props.dm) {
        return <DialogForm
          title="Create Topic"
          id="formNewTopic"
          form={<TopicForm room={this.props.room} />}
          onClose={this.hideForm}
        />;
      } else {
        return <DialogForm
          title="Start Conversation"
          id="formNewConvo"
          form={<ConvoForm room={this.props.room} />}
          onClose={this.hideForm}
        />;
      }
    }
  },
  render() {
    return <div>
      <SubmitButton
        iconName="add"
        label={this.props.dm ? "New Victim" : "New Topic"}
        style={{ width: "100%" }}
        onTouchTap={this.showForm}
      />
      {this.renderForm()}
    </div>;
  }
});

import React from "react";

import TopicForm from "./TopicForm";
import Dialog from "/imports/ui/components/Dialog";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";

export default React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showTopicForm() {
    this.setState({ showForm: true });
  },
  hideTopicForm() {
    this.setState({ showForm: false });
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Create Topic"
        formId="formNewTopic"
        open={true}
        onClose={this.hideTopicForm}
      >
        <TopicForm
          id="formNewTopic"
          room={this.props.room}
          onClose={this.hideTopicForm}
        />
      </Dialog>;
    }
  },
  render() {
    return <div>
      <SubmitButton
        iconName="add"
        label={this.props.dm ? "New Victim" : "New Topic"}
        style={{ width: "100%" }}
        onTouchTap={this.showTopicForm}
      />
      {this.renderForm()}
    </div>;
  }
});

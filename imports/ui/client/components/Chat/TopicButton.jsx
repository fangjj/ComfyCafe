import React from "react";

import TopicForm from "./TopicForm";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

import {
  RaisedButton
} from "material-ui";

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
  render() {
    return <div>
      <SubmitButton
        iconName="add"
        label="New Topic"
        style={{width: "100%"}}
        onTouchTap={this.showTopicForm}
      />
      <TopicForm
        handleClose={this.hideTopicForm}
        open={this.state.showForm}
        room={this.props.room}
      />
    </div>;
  }
});

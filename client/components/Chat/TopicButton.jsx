import React from "react";

let {
  RaisedButton,
  FontIcon
} = mui;

TopicButton = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showTopicForm() {
    this.setState({showForm: true});
  },
  hideTopicForm() {
    this.setState({showForm: false});
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

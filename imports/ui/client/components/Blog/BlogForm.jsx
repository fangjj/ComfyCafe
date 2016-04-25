import React from "react";

import "/imports/api/blog/methods";
import Form from "/imports/ui/client/components/Form";
import VisibilitySelector from "/imports/ui/client/components/VisibilitySelector";
import TextField from "/imports/ui/client/components/TextField";
import TextArea from "/imports/ui/client/components/TextArea";

const defaultState = {
  name: "",
  visibility: "public",
  body: ""
};

export default React.createClass({
  getInitialState() {
    if (this.props.post) {
      return {
        name: this.props.post.name,
        visibility: this.props.post.visibility,
        body: this.props.post.body
      };
    } else {
      return defaultState;
    }
  },
  handleName(e) {
    this.setState({ name: e.target.value });
  },
  handleVisibility(value) {
    this.setState({ visibility: value });
  },
  handleBody(e) {
    this.setState({ body: e.target.value });
  },
  handleSubmit() {
    const data = this.state;

    if (! this.props.post) {
      Meteor.call("addBlogPost", data, (err) => {
        if (err) {
          prettyPrint(err);
        }
      });
    } else {
      Meteor.call("updateBlogPost", this.props.post._id, data, (err) => {
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
        label="Name"
        defaultValue={this.state.name}
        onChange={this.handleName}
      />
      <VisibilitySelector
        visibility={this.state.visibility}
        onChange={this.handleVisibility}
      />
      <TextArea
        label="Body"
        defaultValue={this.state.body}
        rows={4}
        rowsMax={10}
        onChange={this.handleBody}
      />
    </Form>;
  }
});

import React from "react";

import "/imports/api/blog/methods";
import Form from "/imports/ui/client/components/Form";
import VisibilitySelector from "/imports/ui/client/components/VisibilitySelector";
import TextArea from "/imports/ui/client/components/TextArea";

const defaultState = {
  visibility: "public",
  body: ""
};

export default React.createClass({
  getInitialState() {
    if (this.props.post) {
      return {
        visibility: this.props.post.visibility,
        body: this.props.post.body
      };
    } else {
      return defaultState;
    }
  },
  handleVisibility(value) {
    this.setState({visibility: value});
  },
  handleBody(event) {
    this.setState({body: event.target.value});
  },
  handleSubmit() {
    const data = {
      visibility: this.state.visibility,
      body: this.state.body
    };

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
      <VisibilitySelector
        visibility={this.state.visibility}
        onChange={this.handleVisibility}
      />
      <TextArea
        defaultValue={this.state.body}
        label="Body"
        rows={4}
        rowsMax={10}
        onChange={this.handleBody}
      />
    </Form>;
  }
});

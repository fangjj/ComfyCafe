import React from "react";

import "/imports/api/pages/methods";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import TextArea from "/imports/ui/client/components/TextArea";
import VisibilitySelector from "/imports/ui/client/components/VisibilitySelector";

const defaultState = {
  name: "",
  visibility: "public",
  body: ""
};

export default React.createClass({
  getInitialState() {
    return _.defaults(_.pick(this.props.page, _.keys(defaultState)), defaultState);
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

    if (! this.props.page) {
      Meteor.call("addPage", data, (err, slug) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }

          const path = FlowRouter.path("page", {
            username: this.data.currentUser.username,
            slug: slug
          });
          FlowRouter.go(path);
        }
      });
    } else {
      Meteor.call("updatePage", this.props.page._id, data, (err) => {
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
        defaultValue={this.state.name}
        label="Name"
        onChange={this.handleName}
      />
      <VisibilitySelector
        visibility={this.state.visibility}
        onChange={this.handleVisibility}
      />
      <TextArea
        defaultValue={this.state.body}
        label="Body"
        rows={3}
        rowsMax={7}
        onChange={this.handleBody}
      />
    </Form>;
  }
});

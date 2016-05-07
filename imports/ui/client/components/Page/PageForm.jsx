import _ from "lodash";
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
  handlePrivacy(value) {
    this.setState({ privacy: value });
  },
  handleBody(e) {
    this.setState({ body: e.target.value });
  },
  redirect(slug) {
    console.log(this.props.currentUser);
    const path = FlowRouter.path("page", {
      username: _.get(this.props, "page.owner.username", this.props.currentUser.username),
      slug: slug
    });
    FlowRouter.go(path);
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
          this.redirect(slug);
        }
      });
    } else {
      Meteor.call("updatePage", this.props.page._id, data, (err, slug) => {
        if (err) {
          prettyPrint(err);
        } else {
          this.redirect(slug);
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

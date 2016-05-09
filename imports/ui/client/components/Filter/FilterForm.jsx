import _ from "lodash";
import React from "react";

import "/imports/api/filters/methods";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import TagInlineField from "/imports/ui/client/components/Tag/TagInlineField";

const defaultState = {
  name: "",
  spoilers: "",
  hides: ""
};

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    const state = _.defaults(_.pick(this.props.filter, _.keys(defaultState)), defaultState);
    state.spoilers = _.get(state.spoilers, "text", state.spoilers);
    state.hides = _.get(state.hides, "text", state.hides);
    return state;
  },
  handleName(e) {
    this.setState({ name: e.target.value });
  },
  handleSpoilers(value) {
    this.setState({ spoilers: value });
  },
  handleHides(value) {
    this.setState({ hides: value });
  },
  redirect(slugOrId) {
    const path = expr(() => {
      if (this.props.global) {
        return FlowRouter.path("adminView", {
          panel: "filters",
          id: slugOrId
        });
      } else {
        return FlowRouter.path("filter", {
          username: _.get(this.props, "filter.owner.username", this.context.currentUser.username),
          slug: slug
        });
      }
    });
    FlowRouter.go(path);
  },
  handleSubmit() {
    const data = this.state;

    if (! this.props.page) {
      Meteor.call("addFilter", data, this.props.global, (err, slugOrId) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
          this.redirect(slugOrId);
        }
      });
    } else {
      Meteor.call("updateFilter", this.props.filter._id, data, (err, slug) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (! this.props.global) {
            this.redirect(slug);
          }
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
      <TagInlineField
        hintText="Spoilers"
        defaultValue={this.state.spoilers}
        delim=";"
        onChange={this.handleSpoilers}
      />
      <TagInlineField
        hintText="Hides"
        defaultValue={this.state.hides}
        delim=";"
        onChange={this.handleHides}
      />
    </Form>
  }
});

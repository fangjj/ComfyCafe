import _ from "lodash";
import React from "react";

import "/imports/api/filters/methods";
import { initialStateBuilder, dataBuilder } from "/imports/ui/utils/forms";
import Form from "/imports/ui/components/Form";
import TextField from "/imports/ui/components/TextField";
import TagInlineField from "/imports/ui/components/Tag/TagInlineField";
import Checkbox from "/imports/ui/components/Checkbox";

const defaultState = {
  name: "",
  spoilers: "",
  hides: "",
  default: false
};

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    return initialStateBuilder(this.props.filter, defaultState);
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
  handleDefault(e) {
    this.setState({ default: e.target.checked });
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
          slug: slugOrId
        });
      }
    });
    FlowRouter.go(path);
  },
  handleSubmit() {
    const data = dataBuilder(this.state, defaultState);

    if (! this.props.filter) {
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
  renderDefault() {
    if (this.props.global) {
      return <Checkbox
        label="Default?"
        checked={this.state.default}
        onCheck={this.handleDefault}
      />;
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
      {this.renderDefault()}
    </Form>
  }
});

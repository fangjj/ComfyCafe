import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import DenseContent from "/imports/ui/client/components/DenseContent";
import List from "/imports/ui/client/components/List";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import Badge from "/imports/ui/client/components/Badge";
import BadgeTypeSelector from "/imports/ui/client/components/BadgeTypeSelector";

export default React.createClass({
  getInitialState() {
    return _.omit(this.props.badge, ["_id"]);
  },
  handleIcon(e) {
    this.setState({ icon: e.target.value });
  },
  handleName(e) {
    this.setState({ name: e.target.value });
  },
  handleType(value) {
    this.setState({ type: value });
  },
  handleSubmit() {
    Meteor.call("updateBadge", this.props.badge._id, this.state);
  },
  renderPreview() {
    return <Badge badge={this.state} />;
  },
  render() {
    return <DenseContent>
      {this.renderPreview()}
      <Form actions={true} onSubmit={this.handleSubmit}>
        <TextField
          label="Icon"
          defaultValue={this.state.icon}
          onChange={this.handleIcon}
        />
        <TextField
          label="Name"
          defaultValue={this.state.name}
          onChange={this.handleName}
        />
        <BadgeTypeSelector
          badgeValue={this.state.type}
          onChange={this.handleType}
        />
      </Form>
    </DenseContent>;
  }
});

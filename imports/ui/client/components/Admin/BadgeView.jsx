import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import DenseContent from "/imports/ui/client/components/DenseContent";
import List from "/imports/ui/client/components/List";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";

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
  handleType(e) {
    this.setState({ type: e.target.value });
  },
  handleSubmit() {
    Meteor.call("updateBadge", this.props.badge._id, this.state);
  },
  render() {
    return <DenseContent>
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
        <TextField
          label="Type"
          defaultValue={this.state.type}
          onChange={this.handleType}
        />
      </Form>
    </DenseContent>;
  }
});

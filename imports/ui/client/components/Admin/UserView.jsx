import React from "react";

import "/imports/api/users/methods";
import DenseContent from "/imports/ui/client/components/DenseContent";
import List from "/imports/ui/client/components/List";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";

export default React.createClass({
  getInitialState() {
    return {
      badges: _.get(this.props.user, "profile.badges", []).join(", ")
    };
  },
  handleBadges(e) {
    this.setState({ badges: e.target.value });
  },
  handleSubmit() {
    Meteor.call("adminUpdateUser", this.props.user._id, this.state);
  },
  render() {
    return <DenseContent>
      {this.props.user.username
        + " (" + _.get(this.props.user, "profile.displayName", this.props.user.username) + ")"
      }
      <Form actions={true} onSubmit={this.handleSubmit}>
        <TextField
          label="Badges (comma separated)"
          defaultValue={this.state.badges}
          onChange={this.handleBadges}
        />
      </Form>
    </DenseContent>;
  }
});

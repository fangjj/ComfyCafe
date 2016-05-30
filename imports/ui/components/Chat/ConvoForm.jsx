import _ from "lodash";
import React from "react";

import "/imports/api/topics/methods";
import Form from "/imports/ui/components/Form";
import UserField from "/imports/ui/components/User/UserField";

export default React.createClass({
  getInitialState() {
    return { user: null };
  },
  handleUser(userList) {
    this.setState({ user: _.first(commaSplit(userList)) });
  },
  handleSubmit(e) {
    Meteor.call("startConversation", this.state.user, (err, convoId) => {
      if (err) {
        prettyPrint(err);
      } else {
        const url = FlowRouter.path("dm", { username: this.state.user });
        FlowRouter.go(url);
      }
    });
  },
  render() {
    return <Form
      id={this.props.id}
      actions={this.props.actions}
      onSubmit={this.handleSubmit}
      onClose={this.props.onClose}
    >
      <UserField
        id="startConvoWith"
        label="Who to talk to"
        onChange={this.handleUser}
      />
    </Form>;
  }
});

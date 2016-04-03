import React from "react";

import UserSettings from "./UserSettings";

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {};
  },
  getMeteorData() {
    if (this.state.username) {
      const handle = Meteor.subscribe("user", this.state.username);
      return {
        loading: ! handle.ready(),
        user: Meteor.users.findOne(
          {
            _id: { $ne: Meteor.userId() },
            username: this.state.username
          },
          { fields: { username: 1 } }
        ),
        currentUser: Meteor.user()
      };
    } else {
      return {
        loading: false,
        currentUser: Meteor.user()
      };
    }
  },
  setUsername(value) {
    this.setState({
      username: value
    });
  },
  render() {
    return <UserSettings
      currentUser={this.data.currentUser}
      user={this.data.user}
      setUsername={this.setUsername}
    />;
  }
});

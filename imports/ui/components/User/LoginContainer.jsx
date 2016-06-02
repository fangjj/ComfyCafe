import React from "react";

import Login from "./Login";

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
          { username: this.state.username },
          { fields: { username: 1 } }
        )
      };
    } return { loading: false };
  },
  setUsername(value) {
    this.setState({
      username: value
    });
  },
  render() {
    return <Login
      user={this.data.user}
      setUsername={this.setUsername}
      register={this.props.register}
    />;
  }
});

import React from "react";

import UserView from "./UserView";

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const userId = FlowRouter.getParam("id");
    const handle = Meteor.subscribe("user", userId);
    return {
      loading: ! handle.ready(),
      user: Meteor.users.findOne({ _id: userId })
    };
  },
  render() {
    return <UserView {...this.data} />;
  }
});

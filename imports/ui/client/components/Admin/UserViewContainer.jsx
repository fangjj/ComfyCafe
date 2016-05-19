import React from "react";

import UserView from "./UserView";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const userId = FlowRouter.getParam("id");
    const handle = Meteor.subscribe("modUser", userId);
    return {
      loading: ! handle.ready(),
      user: Meteor.users.findOne({ _id: userId })
    };
  },
  render() {
    if (this.data.loading) {
      return <DenseLoadingSpinner />;
    }
    return <UserView {...this.data} />;
  }
});

import React from "react";

import Badges from "/imports/api/badges/collection";
import BadgeView from "./BadgeView";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const badgeId = FlowRouter.getParam("id");
    const handle = Meteor.subscribe("badge", badgeId);
    return {
      loading: ! handle.ready(),
      badge: Badges.findOne({ _id: badgeId })
    };
  },
  render() {
    if (this.data.loading) {
      return <DenseLoadingSpinner />;
    }
    return <BadgeView {...this.data} />;
  }
});

import { createContainer } from "meteor/react-meteor-data";

import Badges from "/imports/api/badges/collection";
import ChatBadgePanel from "./ChatBadgePanel";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("allBadges");
  return {
    loading: ! handle.ready(),
    badges: Badges.find(
      {},
      { sort: { name: 1 } }
    ).fetch()
  };
}, ChatBadgePanel);

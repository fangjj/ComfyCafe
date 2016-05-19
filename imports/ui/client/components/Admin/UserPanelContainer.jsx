import { createContainer } from "meteor/react-meteor-data";

import UserPanel from "./UserPanel";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("modAllUsers");
  return {
    loading: ! handle.ready(),
    users: Meteor.users.find(
      {},
      { sort: { username: 1 } }
    ).fetch()
  };
}, UserPanel);

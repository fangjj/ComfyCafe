import { createContainer } from "meteor/react-meteor-data";

import UserList from "./UserList";

export default createContainer(({ query, userIds }) => {
  if (userIds) {
    const handle = Meteor.subscribe("users", userIds);
    const doc = { _id: { $in: userIds } };
    if (query) {
      doc.$or = [
        { username: { $regex: query, $options: "i" } },
        { "profile.displayName": { $regex: query, $options: "i" } }
      ];
    }
    return {
      loading: ! handle.ready(),
      users: Meteor.users.find(
        doc,
        { sort: { username: 1 } }
      ).fetch()
    };
  } else {
    const handle = Meteor.subscribe("allUsers");
    const doc = {};
    if (query) {
      doc.$or = [
        { username: { $regex: query, $options: "i" } },
        { "profile.displayName": { $regex: query, $options: "i" } }
      ];
    }
    return {
      loading: ! handle.ready(),
      users: Meteor.users.find(
        doc,
        { sort: { username: 1 } }
      ).fetch()
    };
  }
}, UserList);

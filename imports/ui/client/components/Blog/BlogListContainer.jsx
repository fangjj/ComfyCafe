import { createContainer } from "meteor/react-meteor-data";

import BlogPosts from "/imports/api/blog/collection";
import BlogList from "./BlogList";

export default createContainer(({ params }) => {
  let subs = [];
  if (Meteor.userId()) {
    subs = Meteor.user().subscriptions || [];
  }

  const handle = Meteor.subscribe("blogFeed");
  return {
    loading: ! handle.ready(),
    posts: BlogPosts.find(
      { $or: [
        { "owner._id": Meteor.userId() },
        {
          "owner._id": { $in: subs },
          visibility: { $ne: "unlisted" }
        }
      ] },
      { sort: { createdAt: -1, name: 1 } }
    ).fetch()
  };
}, BlogList);

import { createContainer } from "meteor/react-meteor-data";

import Posts from "/imports/api/posts/collection";
import Filters from "/imports/api/filters/collection";
import tagQuery from "/imports/api/tags/query";

import Post from "./Post";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("post",
    FlowRouter.getParam("username"),
    FlowRouter.getParam("postName"),
  );

  const filterHandle = Meteor.subscribe("defaultFilter");
  const filterDoc = {};
  const defaultFilter = _.get(Meteor.user(), "settings.defaultFilter");
  if (defaultFilter) {
    filterDoc._id = defaultFilter;
  } else {
    filterDoc.owner = { $exists: false };
    filterDoc.default = true;
  }

  const data = {
    loading: ! handle.ready(),
    filterLoading: ! filterHandle.ready(),
    post: Posts.findOne(
      {
        "owner.username": FlowRouter.getParam("username"),
        name: FlowRouter.getParam("postName")
      }
    ),
    filter: Session.get("filter") || Filters.findOne(filterDoc),
    spoilered: {},
    currentUser: Meteor.user()
  };

  if (data.filter && data.filter.spoilers.text) {
    const doc = tagQuery(data.filter.spoilers);
    Posts.find(doc).map((post) => {
      data.spoilered[post._id] = _.intersection(post.tags.allTags, data.filter.spoilers.allTags);
    });
  }

  return data;
}, Post);

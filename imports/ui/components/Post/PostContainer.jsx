import _ from "lodash";
import { createContainer } from "meteor/react-meteor-data";

import Posts from "/imports/api/posts/collection";
import Filters from "/imports/api/filters/collection";
import tagQuery from "/imports/api/tags/query";
import tagParser from "/imports/api/tags/parser";
import { tagOrTokenizer } from "/imports/api/tags/tokenizer";

import Post from "./Post";

export default createContainer(({ params }) => {
  const username = FlowRouter.getParam("username");
  if (! username) {
    return {
      loading: ! handle.ready(),
      filterLoading: ! filterHandle.ready(),
      currentUser: Meteor.user()
    };
  }

  const handle = Meteor.subscribe("post",
    username,
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
        "owner.normalizedUsername": username.toLowerCase(),
        name: FlowRouter.getParam("postName")
      }
    ),
    filter: Session.get("filter") || Filters.findOne(filterDoc),
    spoilered: {},
    currentUser: Meteor.user()
  };

  if (data.filter && data.filter.spoilers) {
    const doc = tagQuery(data.filter.spoilers);
    const allTags = _.reduce(
      tagOrTokenizer(data.filter.spoilers),
      (result, v, k) => {
        return _.union(result, tagParser(v).allTags);
      },
      []
    );
    Posts.find(doc).map((post) => {
      data.spoilered[post._id] = _.intersection(post.tags.allTags, allTags);
    });
  }

  return data;
}, Post);

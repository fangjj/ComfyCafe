import _ from "lodash";
import { createContainer } from "meteor/react-meteor-data";

import Albums from "/imports/api/albums/collection";
import Posts from "/imports/api/posts/collection";
import Filters from "/imports/api/filters/collection";
import tagQuery from "/imports/api/tags/query";
import Album from "./Album";

export default createContainer(({ params }) => {
  const username = FlowRouter.getParam("username");
  const slug = FlowRouter.getParam("albumSlug");
  const handle = Meteor.subscribe("album", username, slug);
  const postsHandle = Meteor.subscribe("albumPosts", username, slug);

  const album = Albums.findOne(
    {
      "owner.username": username,
      slug: slug
    }
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
    postsLoading: ! postsHandle.ready(),
    album,
    posts: Posts.find({ _id: { $in: _.get(album, "posts", []) } }).fetch(),
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
}, Album);

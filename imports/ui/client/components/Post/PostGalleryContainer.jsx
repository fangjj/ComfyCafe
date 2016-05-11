import _ from "lodash";
import React from "react";

import Posts from "/imports/api/posts/collection";
import Filters from "/imports/api/filters/collection";
import { postsPerPage } from "/imports/api/posts/constants";
import tagQuery from "/imports/api/tags/query";
import PostGallery from "./PostGallery";
import Powerless from "/imports/ui/client/components/Powerless";

const defaultState = {
  originalOnly: false,
  tagStr: "",
  filter: "sfw",
  noPush: false
};

export default React.createClass({
  mixins: [ReactMeteorData],
  first: true,
  seeded: false,
  getInitialState() {
    const filter = _.get(Meteor.user(), "settings.defaultFilter");
    return {
      originalOnly: (getQueryParam("originalOnly") === "true") || defaultState.originalOnly,
      tagStr: getQueryParam("query") || defaultState.tagStr,
      filter: getQueryParam("filter") || filter || defaultState.filter
    }
  },
  readQueryParams(event) {
    let doc = {
      noPush: true
    };
    const params = {
      originalOnly: getQueryParam("originalOnly"),
      tagStr: getQueryParam("query"),
      filter: getQueryParam("filter")
    };
    _.each(params, (v, k) => {
      if (v !== null) {
        if (typeof defaultState[k] !== "boolean") {
          doc[k] = v;
        } else {
          doc[k] = v === "true";
        }
      }
    });
    if (! _.isEmpty(doc)) {
      this.seeded = true;
    }
    if (params.filter) {
      doc.filterChanged = true;
    }
    this.setState(doc);
  },
  queryBuilder(doc) {
    const queuedParams = [];

    if (this.state.originalOnly) {
      queuedParams.push({ originalOnly: this.state.originalOnly });
      doc.originality = { $ne: "repost" };
    } else {
      queuedParams.push({ originalOnly: undefined });
    }

    if (this.state.tagStr) {
      queuedParams.push({ query: this.state.tagStr });

      const parsed = tagQuery(this.state.tagStr);
      _.each(parsed, (value, key) => {
        if (_.has(doc, key)) {
          prettyPrint(value);
          if (_.includes(["$and", "$or", "$nor"], key)) {
            doc[key].push.apply(doc[key], value);
          } else {
            console.error("PANIC: key " + key + " already present in doc.");
          }
        } else {
          doc[key] = value;
        }
      });
    } else {
      queuedParams.push({ query: undefined });
    }

    if (this.state.filter) {
      if (this.state.filter !== defaultState.filter) {
        queuedParams.push({ filter: this.state.filter });
      } else {
        queuedParams.push({ filter: undefined });
      }
    }

    return queuedParams;
  },
  getMeteorData() {
    const page = Session.get("page") || 0;

    const doc = this.props.generateDoc.bind(this)();

    defaultState.filter = _.get(Meteor.user(), "settings.defaultFilter", defaultState.filter);

    if (! this.state.noPush) {
      const queuedParams = this.queryBuilder(doc);
      const query = setQueryParams(queuedParams);
      if (! this.first || this.seeded) {
        pushState(query);
      }
    }
    this.first = false;

    let arg1 = _.omit(this.state, [ "noPush", "filterChanged" ]);
    arg1.filter = _.get(arg1.filter, "hides.text", "");
    let arg2 = page;
    let arg3;
    if (typeof this.props.subData !== "undefined") {
      arg3 = page;
      arg2 = arg1;
      arg1 = this.props.subData;
    }

    const handle = Meteor.subscribe(this.props.subName, arg1, arg2, arg3);
    const filterHandle = Meteor.subscribe("globalFilters");
    const data = {
      loading: ! handle.ready(),
      filterLoading: ! filterHandle.ready(),
      page: page,
      posts: Posts.find(
        doc,
        {
          sort: { createdAt: -1, name: 1 },
          limit: (page + 1) * postsPerPage
        }
      ).fetch(),
      filters: Filters.find({ owner: { $exists: false } }).fetch(),
      spoilered: {},
      currentUser: Meteor.user()
    };

    const filter = Filters.findOne({ _id: this.state.filter });
    if (filter && filter.spoilers.text) {
      const doc = tagQuery(filter.spoilers);
      Posts.find(doc).map((post) => {
        data.spoilered[post._id] = _.intersection(post.tags.allTags, filter.spoilers.allTags);
      });
    }

    return data;
  },
  componentDidMount() {
    window.addEventListener("popstate", this.readQueryParams);
  },
  componentWillUnmount() {
    window.removeEventListener("popstate", this.readQueryParams);
  },
  handleOriginalOnly(event) {
    this.setState({
      originalOnly: ! this.state.originalOnly,
      noPush: false
    });
  },
  handleSearch(value) {
    this.setState({
      tagStr: value,
      noPush: false
    });
  },
  handleFilter(event, index, value) {
    this.setState({
      filter: value,
      filterChanged: true,
      noPush: false
    });
  },
  render() {
    if (this.props.requireAuth && ! this.data.currentUser) {
      return <Powerless />;
    }

    return <PostGallery
      handleOriginalOnly={this.handleOriginalOnly}
      handleSearch={this.handleSearch}
      handleFilter={this.handleFilter}
      {...this.state}
      {...this.props}
      {...this.data}
    />;
  }
});

import _ from "lodash";
import React from "react";

import Posts from "/imports/api/posts/collection";
import Filters from "/imports/api/filters/collection";
import filtersFor from "/imports/api/filters/filtersFor";
import { postsPerPage } from "/imports/api/posts/constants";
import tagQuery from "/imports/api/tags/query";
import PostGallery from "./PostGallery";
import Powerless from "/imports/ui/client/components/Powerless";

const defaultState = {
  originalOnly: false,
  tagStr: "",
  filterId: undefined,
  noPush: false
};

export default React.createClass({
  mixins: [ReactMeteorData],
  first: true,
  seeded: false,
  getInitialState() {
    const filterId = _.get(Meteor.user(), "settings.defaultFilter");
    return {
      originalOnly: (FlowRouter.getQueryParam("originalOnly") === "true") || defaultState.originalOnly,
      tagStr: FlowRouter.getQueryParam("query") || defaultState.tagStr,
      filterId: FlowRouter.getQueryParam("filter") || filterId || defaultState.filterId
    }
  },
  readQueryParams(event) {
    let doc = { noPush: true };
    const params = {
      originalOnly: FlowRouter.getQueryParam("originalOnly"),
      tagStr: FlowRouter.getQueryParam("query"),
      filter: FlowRouter.getQueryParam("filter")
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
    const queuedParams = {};

    if (this.state.originalOnly) {
      queuedParams.originalOnly = this.state.originalOnly;
      doc.originality = { $ne: "repost" };
    } else {
      queuedParams.originalOnly = null;
    }

    if (this.state.tagStr) {
      queuedParams.query = this.state.tagStr;

      const parsed = tagQuery(this.state.tagStr);
      _.each(parsed, (value, key) => {
        if (_.has(doc, key)) {
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
      queuedParams.query = null;
    }

    if (this.state.filterId) {
      if (this.state.filterId !== defaultState.filterId) {
        queuedParams.filter = this.state.filterId;
      } else {
        queuedParams.filter = null;
      }
    }

    return queuedParams;
  },
  getMeteorData() {
    const page = Session.get("page") || 0;

    const doc = this.props.generateDoc.bind(this)();

    const filterHandle = Meteor.subscribe("filtersFor");
    const defaultFilter = Filters.findOne(
      {
        owner: { $exists: false },
        default: true
      }
    );
    defaultState.filterId = _.get(Meteor.user(), "settings.defaultFilter",
      _.get(defaultFilter, "_id")
    );
    filterId = this.state.filterId || defaultState.filterId;

    if (! this.state.noPush) {
      const queuedParams = this.queryBuilder(doc);
      if (! this.first || this.seeded) {
        const where = window.location.pathname + _.reduce(
          queuedParams,
          (result, value, key) => {
            if (value) {
              if (! result) {
                result = `?${key}=${value}`;
              } else {
                result += `&${key}=${value}`;
              }
            }
            return result;
          },
          ""
        );
        const lastState = Session.get("lastHistState");
        if (where !== lastState) {
          console.log("pushState", where, "lastHistState", lastState);
          FlowRouter.setQueryParams(queuedParams);
          Session.set("lastHistState", where);
        }
      }
    }
    this.first = false;

    let arg1 = _.omit(this.state, [ "noPush", "filterChanged" ]);
    arg1.filterId = filterId;
    let arg2 = page;
    let arg3;
    if (typeof this.props.subData !== "undefined") {
      arg3 = page;
      arg2 = arg1;
      arg1 = this.props.subData;
    }

    const handle = Meteor.subscribe(this.props.subName, arg1, arg2, arg3);
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
      filters: filtersFor().fetch(),
      filter: Filters.findOne({ _id: filterId }),
      spoilered: {},
      currentUser: Meteor.user()
    };

    const filter = Filters.findOne({ _id: filterId });
    Session.set("filter", filter);
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
      filterId: value,
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

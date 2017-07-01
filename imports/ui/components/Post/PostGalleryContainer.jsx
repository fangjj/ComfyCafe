import _ from "lodash";
import React from "react";

import Posts from "/imports/api/posts/collection";
import { postsPerPage } from "/imports/api/posts/constants";
import PostGallery from "./PostGallery";
import Powerless from "/imports/ui/components/Powerless";

const defaultState = {
  originalOnly: false,
  noPush: false
};

export default React.createClass({
  mixins: [ReactMeteorData],
  first: true,
  seeded: false,
  getInitialState() {
    return {
      originalOnly: (FlowRouter.getQueryParam("originalOnly") === "true") || defaultState.originalOnly
    }
  },
  readQueryParams(event) {
    let doc = { noPush: true };
    const params = {
      originalOnly: FlowRouter.getQueryParam("originalOnly")
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
    this.setState(doc);
  },
  queryBuilder(doc) {
    const queuedParams = {};

    if (this.state.originalOnly) {
      queuedParams.originalOnly = this.state.originalOnly;
      doc.original = true;
    } else {
      queuedParams.originalOnly = null;
    }

    return queuedParams;
  },
  getMeteorData() {
    const page = Session.get("page") || 0;

    const doc = this.props.generateDoc.bind(this)();

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

    let arg1 = _.omit(this.state, [ "noPush" ]);
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
      page: page,
      posts: Posts.find(
        doc,
        {
          sort: { createdAt: -1, name: 1 },
          limit: (page + 1) * postsPerPage
        }
      ).fetch(),
      currentUser: Meteor.user()
    };

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
  render() {
    if (this.props.requireAuth && ! this.data.currentUser) {
      return <Powerless />;
    }

    return <PostGallery
      handleOriginalOnly={this.handleOriginalOnly}
      handleSearch={this.handleSearch}
      {...this.state}
      {...this.props}
      {...this.data}
    />;
  }
});

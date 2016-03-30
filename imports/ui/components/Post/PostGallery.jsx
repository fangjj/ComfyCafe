import _ from "lodash";
import React from "react";

import Posts from "/imports/api/posts/collection";

import PostPreview from "./PostPreview";
import PostFilters from "./PostFilters";
import UploadFAB from "../UploadFAB";
import LoadingSpinner from "../LoadingSpinner";
import InlineUhoh from "../InlineUhoh";
import Powerless from "../Powerless";
import TagInlineField from "../Tag/TagInlineField";

import {
  Checkbox,
  FontIcon
} from "material-ui";

const defaultState = {
  originalOnly: false,
  tagStr: "",
  filter: "sfw",
  noPush: false
};

const PostGallery = React.createClass({
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
  componentDidMount() {
    window.addEventListener("popstate", this.readQueryParams);
  },
  componentWillUnmount() {
    window.removeEventListener("popstate", this.readQueryParams);
  },
  getMeteorData() {
    let doc = this.props.generateDoc.bind(this)();

    defaultState.filter = _.get(Meteor.user(), "settings.defaultFilter", defaultState.filter);

    let queuedParams = [];

    if (this.state.originalOnly) {
      queuedParams.push({originalOnly: this.state.originalOnly});
      doc.originality = { $ne: "repost" };
    } else {
      queuedParams.push({originalOnly: undefined});
    }

    if (this.state.tagStr) {
      queuedParams.push({query: this.state.tagStr});

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
      queuedParams.push({query: undefined});
    }

    if (this.state.filter) {
      if (this.state.filter !== defaultState.filter) {
        queuedParams.push({filter: this.state.filter});
      } else {
        queuedParams.push({filter: undefined});
      }
      if (this.state.filter === "all") {
        // noop
      }
      if (this.state.filter === "sfw") {
        doc["safety"] = { $lte: 1 };
      }
      if (this.state.filter === "nsfw") {
        doc["safety"] = { $gte: 2 };
      }
      if (this.state.filter === "your") {
        doc["owner._id"] = Meteor.userId();
      }
    }

    if (! this.state.noPush) {
      const query = setQueryParams(queuedParams);
      if (! this.first || this.seeded) {
        pushState(query);
      }
    }
    this.first = false;

    let handle = Meteor.subscribe(this.props.subName, this.props.subData);
    return {
      loading: ! handle.ready(),
      posts: Posts.find(
  			doc,
  			{ sort: { createdAt: -1, name: 1 } }
  		).fetch(),
      currentUser: Meteor.user()
    };
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
  renderPosts() {
    if (this.data.posts.length) {
      return this.data.posts.map((post) => {
        return <PostPreview
          post={post}
          currentUser={this.data.currentUser}
          key={post._id}
        />;
      });
    } else {
      if (muxOr([
        this.state.originalOnly,
        this.state.tagStr,
        this.state.filter
      ])) {
        return <InlineUhoh>
          No results.
        </InlineUhoh>;
      }
      return this.props.ifEmpty.bind(this)();
    }
  },
  renderFab() {
    if (this.data.currentUser) {
      if (this.props.fabCond) {
        if (this.props.fabCond.bind(this)()) {
          return <UploadFAB />;
        }
      } else if (! this.props.noFab) {
        return <UploadFAB />;
      }
    }
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinner />;
    }

    if (this.props.requireAuth && ! this.data.currentUser) {
      return <Powerless />;
    }

    const posts = this.data.posts;
    return <div className="postGallery content">
      <div className="filter">
        <div>
          <Checkbox
            defaultChecked={this.state.originalOnly}
            label="Original only"
            labelStyle={{fontSize: "20px"}}
            onCheck={this.handleOriginalOnly}
          />
        </div>
        <div style={{flexGrow: 2}}>
          <TagInlineField
            delim=";"
            defaultValue={this.state.tagStr}
            hintText="Search"
            onChange={_.debounce(this.handleSearch, 250)}
          />
        </div>
        <div style={{flexGrow: 1}}>
          <PostFilters
            value={this.state.filter}
            onChange={this.handleFilter}
          />
        </div>
      </div>
      <ul className="gallery">
        {this.renderPosts()}
      </ul>
      {this.renderFab()}
    </div>;
  }
});

export default PostGallery;

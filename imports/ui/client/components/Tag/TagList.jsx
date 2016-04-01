import React from "react";

import Tags from "/imports/api/tags/collection";

import TagListItem from "./TagListItem";
import TagFAB from "./TagFAB";
import LoadingSpinner from "../LoadingSpinner";

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const handle = Meteor.subscribe("allTags");
    return {
      loading: ! handle.ready(),
      tags: Tags.find(
        {},
        { sort: { name: 1 } }
      ).fetch(),
      currentUser: Meteor.user()
    };
  },
  renderTags() {
    if (this.data.tags.length) {
      return this.data.tags.map((tag) => {
        return <TagListItem
          tag={tag}
          currentUser={this.data.currentUser}
          key={tag._id}
        />;
      });
    }
    return <li>No tags.</li>
  },
  renderFab() {
    if (this.data.currentUser) {
      return <TagFAB />;
    }
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinner />;
    }

    return <div className="content">
      <ul className="list">
        {this.renderTags()}
      </ul>
      {this.renderFab()}
    </div>;
  }
});

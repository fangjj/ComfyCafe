import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";

import ToggleButton from "./ToggleButton";

export default React.createClass({
  toggleBookmark() {
    const bookmarked = this.props.currentUser
      && _.includes(this.props.currentUser.bookmarks, this.props.post._id);
    Meteor.call("bookmarkPost", this.props.post._id, ! bookmarked);
  },
  render() {
    const bookmarked = _.includes(
      _.get(this.props, "currentUser.bookmarks", []),
      this.props.post._id
    );
    return <ToggleButton
      className="bookmark"
      active={bookmarked}
      activate={this.toggleBookmark}
      deactivate={this.toggleBookmark}
      labelActivate="Bookmark"
      iconActivate="bookmark_outline"
      labelActivated="Bookmarked"
      iconActivated="bookmark"
      labelDeactivate="Unbookmark"
      iconDeactivate="bookmark_outline"
      width={174}
    />;
  }
});

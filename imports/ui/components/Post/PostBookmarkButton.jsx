import _ from "lodash";
import React from "react";

import {
  IconButton,
  FontIcon
} from "material-ui";

const PostBookmarkButton = React.createClass({
  toggle(next) {
    Meteor.call("bookmarkPost", this.props.post._id, next);
  },
  render() {
    const active = _.includes(this.props.currentUser.bookmarks, this.props.post._id);
    let iconName = "bookmark_border";
    if (active) {
      iconName = "bookmark";
    }
    return <div className="more">
      <IconButton onTouchTap={this.toggle.bind(this, ! active)}>
        <FontIcon className="material-icons">{iconName}</FontIcon>
      </IconButton>
    </div>;
  }
});

export default PostBookmarkButton;

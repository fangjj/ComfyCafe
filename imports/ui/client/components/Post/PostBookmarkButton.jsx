import _ from "lodash";
import React from "react";

import "/imports/api/posts/methods";

import Icon from "../Icon";

import {
  IconButton
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
        <Icon>{iconName}</Icon>
      </IconButton>
    </div>;
  }
});

export default PostBookmarkButton;

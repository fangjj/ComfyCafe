import _ from "lodash";
import React from "react";

import "/imports/api/posts/methods";

import {
  FloatingActionButton,
  FontIcon
} from "material-ui";

const PostLikeFAB = React.createClass({
  like() {
    var post = this.props.post;
    Meteor.call("likePost", post._id, ! _.includes(post.likes, this.props.userId));
  },
  render() {
    var liked = _.includes(this.props.post.likes, this.props.userId);
    return <div className="fixed-action-btn">
      <FloatingActionButton secondary={true} onClick={this.like}>
        <FontIcon className="material-icons">{liked ? "favorite" : "favorite_border"}</FontIcon>
      </FloatingActionButton>
    </div>;
  }
});

export default PostLikeFAB;

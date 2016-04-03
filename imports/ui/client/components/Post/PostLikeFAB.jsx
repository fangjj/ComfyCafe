import _ from "lodash";
import React from "react";

import "/imports/api/posts/methods";

import Icon from "/imports/ui/client/components/Daikon/Icon";

import {
  FloatingActionButton
} from "material-ui";

const PostLikeFAB = React.createClass({
  like() {
    var post = this.props.post;
    Meteor.call("likePost", post._id, ! _.includes(post.likes, this.props.userId));
  },
  render() {
    var liked = _.includes(this.props.post.likes, this.props.userId);
    return <div className="fixed-action-btn">
      <FloatingActionButton primary={true} onClick={this.like}>
        <Icon>{liked ? "favorite" : "favorite_border"}</Icon>
      </FloatingActionButton>
    </div>;
  }
});

export default PostLikeFAB;

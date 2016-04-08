import _ from "lodash";
import React from "react";

import "/imports/api/posts/methods";

import FAB from "/imports/ui/client/components/FAB";

export default React.createClass({
  like() {
    const post = this.props.post;
    Meteor.call("likePost", post._id, ! _.includes(post.likes, this.props.userId));
  },
  render() {
    const liked = _.includes(this.props.post.likes, this.props.userId);
    return <FAB iconName={liked ? "favorite" : "favorite_border"} onTouchTap={this.like} />;
  }
});

import React from "react";

import { getMediaUrlAvatar, getMediaUrlDjent } from "/imports/api/media/urls";
import thumbnailPolicies from "/imports/api/thumbnails/policies";

export default React.createClass({
  render() {
    const size = thumbnailPolicies.avatar[this.props.size].size;

    const user = this.props.user;
    let url;
    if (user.profile.avatar && ! this.props.spoilered) {
      url = getMediaUrlAvatar(user._id, user.profile.avatar._id, this.props.size);
    } else {
      url = getMediaUrlDjent(user._id);
    };
    return <img
      className={"avatar " + this.props.size}
      src={url}
      title={user.profile.displayName || user.username}
      width={size[0]}
      height={size[1]}
    />;
  }
});

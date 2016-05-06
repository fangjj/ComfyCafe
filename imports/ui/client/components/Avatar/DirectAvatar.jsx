import React from "react";

import { getMediaUrlMD5, getMediaUrlDjent } from "/imports/api/media/urls";
import thumbnailPolicies from "/imports/api/thumbnails/policies";

const DirectAvatar = React.createClass({
  render() {
    const size = thumbnailPolicies.avatar[this.props.size].size;

    const user = this.props.user;
    var hasAvatars = Boolean(user.avatars);
    if (hasAvatars) {
      const avatar = user.avatars[this.props.size] || user.avatars.fullsize;
      if (avatar) {
        return <img
          className={"avatar " + this.props.size}
          src={getMediaUrlMD5(avatar.md5)}
          title={user.profile.displayName || user.username}
          width={size[0]}
          height={size[1]}
        />
      }
    }

    return <img
      className={"avatar " + this.props.size}
      src={getMediaUrlDjent(user._id)}
      title={user.profile.displayName || user.username}
      width={size[0]}
      height={size[1]}
    />
  }
});

export default DirectAvatar;

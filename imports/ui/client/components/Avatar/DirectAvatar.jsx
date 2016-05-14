import _ from "lodash";
import React from "react";

import { getMediaUrlMD5, getMediaUrlDjent } from "/imports/api/media/urls";
import thumbnailPolicies from "/imports/api/thumbnails/policies";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  render() {
    const size = thumbnailPolicies.avatar[this.props.size].size;

    const user = this.props.user;

    const spoilered = _.includes(
      _.get(this.context.currentUser, "defaultFilter.spoilers.safeties", []),
      _.get(user, "profile.avatarSafety", 0)
    );

    const hasAvatars = Boolean(user.avatars);
    if (hasAvatars && ! spoilered) {
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

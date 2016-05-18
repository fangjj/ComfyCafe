import _ from "lodash";
import React from "react";

import { getMediaUrlAvatar, getMediaUrlDjent } from "/imports/api/media/urls";
import thumbnailPolicies from "/imports/api/thumbnails/policies";
import UserStatus from "/imports/ui/client/components/User/UserStatus";

export default React.createClass({
  mixins: [ReactMeteorData],
  contextTypes: { currentUser: React.PropTypes.object },
  getMeteorData() {
    return { filter: Session.get("filter") };
  },
  render() {
    const size = thumbnailPolicies.avatar[this.props.size].size;

    const user = this.props.user;

    const spoilered = _.includes(
      _.get(this.data.filter, "spoilers.safeties",
        _.get(this.context.currentUser, "defaultFilter.spoilers.safeties", [2, 3])
      ),
      _.get(user, "profile.avatarSafety", 0)
    );

    let url;
    if (user.profile.avatar && ! spoilered) {
      url = getMediaUrlAvatar(user._id, user.profile.avatar._id, this.props.size);
    } else {
      url = getMediaUrlDjent(user._id);
    };
    return <div className={"avatarContainer " + this.props.size}>
      <img
        className={"avatar " + this.props.size}
        src={url}
        title={user.profile.displayName || user.username}
        width={size[0]}
        height={size[1]}
      />
      <UserStatus user={user} />
    </div>;
  }
});

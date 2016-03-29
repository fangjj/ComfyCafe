import React from "react";

const Avatar = React.createClass({
  render() {
    const size = thumbnailPolicies.avatar[this.props.size].size;

    const user = this.props.user;
    let url;
    if (user.profile.avatar) {
      url = "/gridfs/media/user/" + user._id + "/" + user.profile.avatar._id;
    } else {
      url = "/gridfs/media/djent/" + user._id;
    }
    url += "?size=" + this.props.size;
    return <img
      className={"avatar " + this.props.size}
      src={url}
      title={user.profile.displayName || user.username}
      width={size[0]}
      height={size[1]}
    />;
  }
});

export default Avatar;

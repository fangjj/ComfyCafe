DirectAvatar = React.createClass({
  render() {
    const user = this.props.user;
    var hasAvatars = Boolean(user.avatars);
    if (hasAvatars) {
      var md5 = (user.avatars[this.props.size] || user.avatars.fullsize).md5;
  		return <img
        className={"avatar " + this.props.size}
        src={"/gridfs/media/" + md5}
        title={user.profile.displayName || user.username}
      />
    } else {
		  return <img
        className={"avatar " + this.props.size}
        src={"/gridfs/media/djent/" + user._id}
        title={user.profile.displayName || user.username}
      />
    }
  }
});

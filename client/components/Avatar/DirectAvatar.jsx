DirectAvatar = React.createClass({
  render() {
    const user = this.props.user;
    var hasAvatars = Boolean(user.avatars);
    if (hasAvatars) {
      const avatar = user.avatars[this.props.size] || user.avatars.fullsize;
      if (avatar) {
        return <img
          className={"avatar " + this.props.size}
          src={"/gridfs/media/" + avatar.md5}
          title={user.profile.displayName || user.username}
        />
      }
    }

    return <img
      className={"avatar " + this.props.size}
      src={"/gridfs/media/djent/" + user._id}
      title={user.profile.displayName || user.username}
    />
  }
});

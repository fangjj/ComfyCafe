ReactiveAvatarComponent = React.createClass({
  render() {
    var hasAvatars = Boolean(this.props.avatars);
    if (hasAvatars) {
      var md5 = (this.props.avatars[this.props.class] || this.props.avatars.fullsize).md5;
  		return <img
        className={"avatar " + this.props.class}
        src={"/gridfs/media/" + md5}
        title={this.props.title}
      />
    } else {
		  return <img
        className={"avatar " + this.props.class}
        src={"/gridfs/media/djent/" + this.props.id}
        title={this.props.title}
      />
    }
  }
});

AvatarComponent = React.createClass({
  render() {
    return <img
      className={"avatar " + this.props.class}
      src={"/gridfs/media/user/" + this.props.id + "?thumb=" + this.props.class}
      title={this.props.title}
    />;
  }
});

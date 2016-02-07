MediumComponent = React.createClass({
  render() {
    var medium = this.props.medium;
    var type = medium.contentType.split("/")[0];
    var src = "/gridfs/media/" + medium.md5;
    return {
      image: <img src={src} />,
      video: <video id={"video" + medium._id} src={src} controls>
        <source src={src} type={medium.contentType} />
      </video>,
      audio: <audio id={"audio" + medium._id} src={src} controls>
        <source src={src} type={medium.contentType} />
      </audio>
    }[type];
  }
});

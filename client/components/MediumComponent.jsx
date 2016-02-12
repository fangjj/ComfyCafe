MediumComponent = React.createClass({
  render() {
    var medium = this.props.medium;
    var type = medium.contentType.split("/")[0];
    var src = "/gridfs/media/" + medium.md5;
    return {
      image: <img className="mediumContent" src={src} />,
      video: <video className="mediumContent" id={"video" + medium._id} src={src} controls>
        <source src={src} type={medium.contentType} />
      </video>,
      audio: <audio className="mediumContent" id={"audio" + medium._id} src={src} controls>
        <source src={src} type={medium.contentType} />
      </audio>
    }[type];
  }
});

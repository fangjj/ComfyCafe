MediumComponent = React.createClass({
  render() {
    var medium = this.props.medium;
    var type = medium.contentType.split("/")[0];
    var src = "/gridfs/media/" + medium.md5;
    var medium = {
      image: <img className="medium" src={src} />,
      video: <video className="medium" id={"video" + medium._id} src={src} controls>
        <source src={src} type={medium.contentType} />
      </video>,
      audio: <audio className="medium" id={"audio" + medium._id} src={src} controls>
        <source src={src} type={medium.contentType} />
      </audio>
    }[type];
    return <div className="mediumContainer">
      {medium}
    </div>;
  }
});

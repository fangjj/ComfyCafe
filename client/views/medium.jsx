MediumComponent = React.createClass({
  render: function () {
    var medium = this.props.medium;
    var type = medium.contentType.split("/")[0];
    var src = "/gridfs/media/" + medium.md5;
    if (type === "image") {
      return <img src={src} />;
    }
    if (type === "video") {
      return <video id={"video" + medium._id} src={src} controls>
        <source src={src} type={medium.contentType} />
      </video>;
    }
    if (type === "audio") {
      return <audio id={"audio" + medium._id} src={src} controls>
        <source src={src} type={medium.contentType} />
      </audio>;
    }
  }
});

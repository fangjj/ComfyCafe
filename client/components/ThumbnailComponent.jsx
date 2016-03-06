ThumbnailComponent = React.createClass({
  render() {
    var medium = this.props.medium;
    var size = this.props.size;
    var thumbTerminated = medium.thumbnails
      && medium.thumbnails[size]
      && medium.thumbnails[size].terminated;

    var thumbnail;

    if (! thumbTerminated) {
      if (medium.thumbnails) {
        let thumb = medium.thumbnails[size];
        thumbnail = <PretentiousImage
          className="thumbnail"
          src={"/gridfs/media/id/" + thumb._id + "?size=" + size}
          pretentiousFilter={this.props.pretentiousFilter}
        />;
      } else {
        thumbnail = <SpinnerComponent />;
      }
    } else {
      thumbnail = <div className="thumbnail">
        <i className="material-icons large">image</i>
      </div>;
    }

    return <div className="thumbnailContainer">
      {thumbnail}
    </div>;
  }
});

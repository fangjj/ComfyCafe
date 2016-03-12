ThumbnailComponent = React.createClass({
  render() {
    const medium = this.props.medium;
    const type = medium.contentType.split("/")[0];
    const size = this.props.size;
    const thumbTerminated = medium.thumbnails
      && medium.thumbnails[size]
      && medium.thumbnails[size].terminated;

    let thumbnail;

    if (type !== "audio") {
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
    } else {
      thumbnail = <div className="thumbnail">
        <i className="material-icons large">audiotrack</i>
      </div>;
    }

    return <div className="thumbnailContainer">
      {thumbnail}
    </div>;
  }
});

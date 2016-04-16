import React from "react";

import Image from "/imports/ui/client/components/Image";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import Spinner from "/imports/ui/client/components/Spinner/Spinner";

export default React.createClass({
  renderPlay(type) {
    if (type === "video") {
      return <div className="play">
        <i className="material-icons large">play_circle_outline</i>
      </div>;
    }
  },
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
          thumbnail = <Image
            className="thumbnail"
            src={"/gridfs/media/id/" + thumb._id + "?size=" + size}
            filter={this.props.filter}
          />;
        } else {
          thumbnail = <Spinner />;
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
      {this.renderPlay(type)}
    </div>;
  }
});

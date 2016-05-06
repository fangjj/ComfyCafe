import _ from "lodash";
import React from "react";

import { getMediaUrlID } from "/imports/api/media/urls";
import Image from "/imports/ui/client/components/Image";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import Spinner from "/imports/ui/client/components/Spinner/Spinner";

export default React.createClass({
  renderPlay(type) {
    if (type === "video") {
      return <div className="play">
        <Icon className="large">play_circle_outline</Icon>
      </div>;
    }
  },
  render() {
    const medium = this.props.medium;
    const type = medium.contentType.split("/")[0];
    const size = this.props.size;
    const thumbComplete = _.includes(medium.thumbsComplete, size);
    const thumbTerminated = _.includes(medium.thumbsTerminated, size);

    let thumbnail;

    if (type !== "audio") {
      if (! thumbTerminated) {
        if (thumbComplete) {
          thumbnail = <Image
            className="thumbnail"
            src={getMediaUrlID(medium._id, size)}
            filter={this.props.filter}
          />;
        } else {
          thumbnail = <Spinner />;
        }
      } else {
        thumbnail = <div className="thumbnail">
          <Icon className="large">image</Icon>
        </div>;
      }
    } else {
      thumbnail = <div className="thumbnail">
        <Icon className="large">audiotrack</Icon>
      </div>;
    }

    return <div className="thumbnailContainer">
      {thumbnail}
      {this.renderPlay(type)}
    </div>;
  }
});

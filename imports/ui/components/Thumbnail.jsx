import _ from "lodash";
import React from "react";

import { getMediaUrlID } from "/imports/api/media/urls";
import Icon from "/imports/ui/components/Daikon/Icon";
import Spinner from "/imports/ui/components/Spinner/Spinner";

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
    if (! medium || _.isEmpty(medium)) {
      return null;
    }

    const type = medium.contentType.split("/")[0];
    const size = this.props.size;
    const thumbComplete = _.includes(medium.thumbsComplete, size);
    const thumbTerminated = _.includes(medium.thumbsTerminated, size);

    let thumbnail;

    if (type !== "audio") {
      if (! thumbTerminated) {
        if (thumbComplete) {
          thumbnail = <img
            className="thumbnail"
            src={getMediaUrlID(medium._id, size)}
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

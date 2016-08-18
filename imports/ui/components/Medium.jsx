import React from "react";

import { getMediaUrlMD5 } from "/imports/api/media/urls";
import classConcat from "/imports/ui/utils/classConcat";

import ZoomableImageProxy from "./ZoomableImageProxy";

export default React.createClass({
  render() {
    const medium = this.props.medium;
    const type = medium.contentType.split("/")[0];
    const src = getMediaUrlMD5(medium.md5, medium.contentType.split("/")[1]);
    let classes = classConcat("medium", this.props.className);
    const mediumCmp = {
      image: <ZoomableImageProxy
        className={classes}
        src={src}
        width={medium.width}
        height={medium.height}
        safety={this.props.safety}
        spoilered={this.props.spoilered}
        reason={this.props.reason}
      />,
      video: <video className="medium" id={"video" + medium._id} src={src} width="100%" controls loop={this.props.loop}>
        <source src={src} type={medium.contentType} />
      </video>,
      audio: <audio className="medium" id={"audio" + medium._id} src={src} controls loop={this.props.loop}>
        <source src={src} type={medium.contentType} />
      </audio>
    }[type];
    return <div className={"mediumContainer " + type}>
      {mediumCmp}
    </div>;
  }
});

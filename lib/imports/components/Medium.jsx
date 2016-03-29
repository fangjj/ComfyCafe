import React from "react";

Medium = React.createClass({
  render() {
    const medium = this.props.medium;
    const type = medium.contentType.split("/")[0];
    const src = "/gridfs/media/" + medium.md5;
    let classes = classConcat("medium", this.props.className);
    const mediumCmp = {
      image: <PretentiousImage
        className={classes}
        src={src}
        width={medium.width}
        height={medium.height}
        pretentiousFilter={this.props.pretentiousFilter}
        moonbox={true}
      />,
      video: <video className="medium" id={"video" + medium._id} src={src} controls>
        <source src={src} type={medium.contentType} />
      </video>,
      audio: <audio className="medium" id={"audio" + medium._id} src={src} controls>
        <source src={src} type={medium.contentType} />
      </audio>
    }[type];
    return <div className="mediumContainer">
      {mediumCmp}
    </div>;
  }
});

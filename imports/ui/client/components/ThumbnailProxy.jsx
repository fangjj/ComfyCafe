import React from "react";

import ImageSpoiler from "/imports/ui/client/components/ImageSpoiler";
import Thumbnail from "/imports/ui/client/components/Thumbnail";

export default (props) => {
  if (props.spoilered) {
    return <div className="thumbnailContainer">
      <ImageSpoiler {...props} />
    </div>;
  } else {
    return <Thumbnail {...props} />;
  }
};

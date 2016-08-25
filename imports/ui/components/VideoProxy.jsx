import _ from "lodash";
import React from "react";

import ImageSpoiler from "/imports/ui/components/ImageSpoiler";

export default React.createClass({
  getInitialState() {
    return { spoilered: this.props.spoilered };
  },
  handleTouch(event) {
    // 1 = left; 0 = mobile tap
    if (event.nativeEvent.which === 1 || event.nativeEvent.which === 0) {
      if (this.state.spoilered) {
        this.setState({ spoilered: false });
      }
    }
  },
  render() {
    if (this.state.spoilered) {
      return <div>
        <ImageSpoiler {...this.props} onTouchTap={this.handleTouch} />
      </div>;
    } else {
      const medium = this.props.medium;
      return <video className="medium" id={"video" + medium._id} src={this.props.src}
        width="100%" controls loop={this.props.loop}>
        <source src={this.props.src} type={medium.contentType} />
      </video>;
    }
  }
});

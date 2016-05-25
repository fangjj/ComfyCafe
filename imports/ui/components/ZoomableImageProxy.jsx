import _ from "lodash";
import React from "react";

import ImageSpoiler from "/imports/ui/components/ImageSpoiler";
import ZoomableImage from "/imports/ui/components/ZoomableImage";

export default React.createClass({
  getInitialState() {
    return { spoilered: this.props.spoilered };
  },
  handleTouch(event) {
    if (event.nativeEvent.which === 1) {
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
      return <ZoomableImage {...this.props} />;
    }
  }
});
import _ from "lodash";
import React from "react";

import ImageSpoiler from "/imports/ui/client/components/ImageSpoiler";
import ZoomableImage from "/imports/ui/client/components/ZoomableImage";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    return { spoilered: false };
  },
  componentWillMount() {
    if (this.props.safety > 0) {
      this.setState({ spoilered: true });
    }
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

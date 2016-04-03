import React from "react";

import RainbowSpinner from "./RainbowSpinner";

export default React.createClass({
  render() {
    return <div className="denseLoadingSpinner center">
      <RainbowSpinner />
    </div>;
  }
});

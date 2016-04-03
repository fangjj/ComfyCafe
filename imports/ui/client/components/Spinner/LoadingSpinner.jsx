import React from "react";

import RainbowSpinner from "./RainbowSpinner";

const LoadingSpinner = React.createClass({
  render() {
    return <div id="loadingSpinner" className="content center">
      <RainbowSpinner />
    </div>;
  }
});

export default LoadingSpinner;

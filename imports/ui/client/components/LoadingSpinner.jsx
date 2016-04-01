import React from "react";

import RainbowSpinnerComponent from "./RainbowSpinnerComponent";

const LoadingSpinner = React.createClass({
  render() {
    return <div id="loadingSpinner" className="content center">
      <RainbowSpinnerComponent />
    </div>;
  }
});

export default LoadingSpinner;

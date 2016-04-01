import React from "react";

import RainbowSpinnerComponent from "./RainbowSpinnerComponent";

export default React.createClass({
  render() {
    return <div className="denseLoadingSpinner center">
      <RainbowSpinnerComponent />
    </div>;
  }
});

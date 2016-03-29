import React from "react";

import RainbowSpinnerComponent from "./RainbowSpinnerComponent";

const InlineLoadingSpinner = React.createClass({
  render() {
    return <div className="inlineLoadingSpinner center">
      <RainbowSpinnerComponent />
    </div>;
  }
});

export default InlineLoadingSpinner;

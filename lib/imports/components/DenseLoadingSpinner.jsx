import React from "react";

const DenseLoadingSpinner = React.createClass({
  render() {
    return <div className="denseLoadingSpinner center">
      <RainbowSpinnerComponent />
    </div>;
  }
});

export default DenseLoadingSpinner;

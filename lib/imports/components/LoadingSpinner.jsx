import React from "react";

const LoadingSpinner = React.createClass({
  render() {
    return <div id="loadingSpinner" className="content center">
      <RainbowSpinnerComponent />
    </div>;
  }
});

export default LoadingSpinner;

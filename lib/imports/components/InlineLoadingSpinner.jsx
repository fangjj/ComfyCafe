import React from "react";

const InlineLoadingSpinner = React.createClass({
  render() {
    return <div className="inlineLoadingSpinner center">
      <RainbowSpinnerComponent />
    </div>;
  }
});

export default InlineLoadingSpinner;

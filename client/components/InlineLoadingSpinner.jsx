import React from "react";

InlineLoadingSpinner = React.createClass({
  render() {
    return <div className="inlineLoadingSpinner center">
      <RainbowSpinnerComponent />
    </div>;
  }
});

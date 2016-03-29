import React from "react";

LoadingSpinner = React.createClass({
  render() {
    return <div id="loadingSpinner" className="content center">
      <RainbowSpinnerComponent />
    </div>;
  }
});

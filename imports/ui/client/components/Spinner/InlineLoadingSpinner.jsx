import React from "react";

import RainbowSpinner from "./RainbowSpinner";

const InlineLoadingSpinner = React.createClass({
  render() {
    return <div className="inlineLoadingSpinner center">
      <RainbowSpinner />
    </div>;
  }
});

export default InlineLoadingSpinner;

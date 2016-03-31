import React from "react";

const Overlay = React.createClass({
  render() {
    return <div
      className="overlayContainer"
      style={{display: this.props.show ? "block" : "none"}}
    >
      {this.props.children}
      <div className="overlay" />
    </div>;
  }
});

export default Overlay;

import React from "react";

DenseLayout = React.createClass({
  render() {
    return <div className="denseLayout">
      {this.props.children}
    </div>;
  }
});

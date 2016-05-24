import React from "react";

const DenseLayout = React.createClass({
  render() {
    return <div className="denseLayout">
      {this.props.children}
    </div>;
  }
});

export default DenseLayout;

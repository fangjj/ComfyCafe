import React from "react";

const Uhoh = React.createClass({
  render() {
    return <div className="uhoh content">
      {this.props.children}
    </div>;
  }
});

export default Uhoh;

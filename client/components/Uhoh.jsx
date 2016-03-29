import React from "react";

Uhoh = React.createClass({
  render() {
    return <div className="uhoh content">
      {this.props.children}
    </div>;
  }
});

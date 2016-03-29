import React from "react";

InlineUhoh = React.createClass({
  render() {
    return <div className="uhoh">
      {this.props.children}
    </div>;
  }
});

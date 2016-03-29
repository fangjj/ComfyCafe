import React from "react";

const InlineUhoh = React.createClass({
  render() {
    return <div className="uhoh">
      {this.props.children}
    </div>;
  }
});

export default InlineUhoh;

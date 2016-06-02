import React from "react";

export default React.createClass({
  render() {
    const { _id } = this.props.item;
    return <li>
      {_id}
    </li>;
  }
});

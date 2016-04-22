import React from "react";

export default React.createClass({
  render() {
    return <li>{this.props.album.name}</li>;
  }
});

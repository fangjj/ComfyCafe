import React from "react";

import {
  MenuItem
} from "material-ui";

export default React.createClass({
  renderInner() {
    if (this.props.children) {
      return this.props.children;
    }
  },
  render() {
    return <MenuItem
      primaryText={this.props.primaryText}
      onClick={this.props.onClick}
    >
      {this.renderInner()}
      <a className="fill" href={this.props.href}></a>
    </MenuItem>;
  }
});

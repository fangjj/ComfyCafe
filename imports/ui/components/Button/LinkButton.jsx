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
      onTouchTap={this.props.onTouchTap}
    >
      {this.renderInner()}
      <a className="fill" href={this.props.href}></a>
    </MenuItem>;
  }
});
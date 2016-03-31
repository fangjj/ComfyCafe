import React from "react";

import Icon from "../Icon";

import {
  MenuItem
} from "material-ui";

const TopMenuItem = React.createClass({
  render() {
    let leftIcon;
    if (this.props.leftIconName) {
      leftIcon = <Icon>{this.props.leftIconName}</Icon>;
    }
    let rightIcon;
    if (this.props.rightIconName) {
      rightIcon = <Icon>{this.props.rightIconName}</Icon>;
    }
    return <MenuItem
      primaryText={this.props.primaryText}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      onTouchTap={this.props.onTouchTap}
    >
      <a className="fill" href={this.props.href}></a>
    </MenuItem>;
  }
});

export default TopMenuItem;

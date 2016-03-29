import React from "react";

let {
  MenuItem,
  FontIcon
} = mui;

TopMenuItem = React.createClass({
  render() {
    let leftIcon;
    if (this.props.leftIconName) {
      leftIcon = <FontIcon className="material-icons">{this.props.leftIconName}</FontIcon>;
    }
    let rightIcon;
    if (this.props.rightIconName) {
      rightIcon = <FontIcon className="material-icons">{this.props.rightIconName}</FontIcon>;
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

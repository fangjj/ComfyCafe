import React from "react";

import {
  RaisedButton,
  FontIcon
} from "material-ui";

const SubtleDangerButton = React.createClass({
  getInitialState() {
    return {
      hover: false
    };
  },
  toggleHover() {
    this.setState({hover: ! this.state.hover});
  },
  render() {
    var clases;
    if (! this.state.hover) {
      classes = "grey darken-2";
    } else {
      classes = "red darken-3";
    }
    return <RaisedButton
      className={classes}
      label={this.props.label}
      labelStyle={{fontSize: "18px"}}
      icon={<FontIcon className="material-icons">{this.props.iconName}</FontIcon>}
      onTouchTap={this.props.onTouchTap}
      onMouseEnter={this.toggleHover}
      onMouseLeave={this.toggleHover}
    />
  }
});

export default SubtleDangerButton;

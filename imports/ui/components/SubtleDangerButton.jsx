import React from "react";

import Colors from "/imports/ui/colors";
import Icon from "./Icon";

import {
  RaisedButton
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
    let color;
    if (! this.state.hover) {
      color = Colors.scaryCherry;
    } else {
      color = Colors.reassuringGray;
    }
    return <RaisedButton
      backgroundColor={color}
      label={this.props.label}
      labelStyle={{fontSize: "18px"}}
      icon={<Icon>{this.props.iconName}</Icon>}
      onTouchTap={this.props.onTouchTap}
      onMouseEnter={this.toggleHover}
      onMouseLeave={this.toggleHover}
    />
  }
});

export default SubtleDangerButton;

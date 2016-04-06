import React from "react";

import Colors from "/imports/ui/client/utils/colors";
import Icon from "/imports/ui/client/components/Daikon/Icon";

import {
  RaisedButton
} from "material-ui";

const SubtleDangerButton = React.createClass({
  getInitialState() {
    return {
      hover: false
    };
  },
  hover() {
    this.setState({ hover: true });
  },
  unhover() {
    this.setState({ hover: false });
  },
  render() {
    let color;
    if (! this.state.hover) {
      color = Colors.reassuringGray;
    } else {
      color = Colors.scaryCherry;
    }
    return <RaisedButton
      backgroundColor={color}
      label={this.props.label}
      labelStyle={{fontSize: "18px"}}
      icon={<Icon>{this.props.iconName}</Icon>}
      onTouchTap={this.props.onTouchTap}
      onMouseEnter={this.hover}
      onMouseLeave={this.unhover}
    />
  }
});

export default SubtleDangerButton;

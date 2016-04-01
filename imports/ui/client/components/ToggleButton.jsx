import React from "react";

import Colors from "/imports/ui/client/utils/colors";
import Icon from "./Icon";

import {
  RaisedButton
} from "material-ui";

const ToggleButton = React.createClass({
  getInitialState() {
    return {
      notHover: true
    };
  },
  hoverOn() {
    this.setState({notHover: false});
  },
  hoverOff() {
    this.setState({notHover: true});
  },
  render() {
    if (! this.props.active) {
      return <RaisedButton
        label={this.props.labelActivate}
        labelStyle={{fontSize: "18px"}}
        primary={true}
        icon={<Icon>{this.props.iconActivate}</Icon>}
        style={{width: this.props.width}}
        onTouchTap={this.props.activate}
      />;
    } else {
      let color = Colors.reassuringGray;
      let label;
      let icon;
      if (this.state.notHover) {
        label = this.props.labelActivated;
        icon = this.props.iconActivated;
      } else {
        if (this.props.dangerous) {
          color = Colors.scaryCherry;
        }
        label = this.props.labelDeactivate;
        icon = this.props.iconDeactivate;
      }
      return <RaisedButton
        backgroundColor={color}
        label={label}
        labelStyle={{fontSize: "18px"}}
        icon={<Icon>{icon}</Icon>}
        style={{width: this.props.width}}
        onTouchTap={this.props.deactivate}
        onMouseEnter={this.hoverOn}
        onMouseLeave={this.hoverOff}
      />;
    }
  }
});

export default ToggleButton;

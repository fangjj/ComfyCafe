import React from "react";

import Colors from "/imports/ui/utils/colors";
import Button from "/imports/ui/components/Button/Button";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";

export default React.createClass({
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
      return <SubmitButton
        label={this.props.labelActivate}
        iconName={this.props.iconActivate}
        width={this.props.width}
        onClick={this.props.activate}
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
      return <Button
        backgroundColor={color}
        label={label}
        iconName={icon}
        width={this.props.width}
        onClick={this.props.deactivate}
        onMouseEnter={this.hoverOn}
        onMouseLeave={this.hoverOff}
      />;
    }
  }
});

import React from "react";

import Colors from "/imports/ui/utils/colors";
import Button from "/imports/ui/components/Button/Button";

export default React.createClass({
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
    const { iconName, subtle, ...leftoverProps } = this.props;
    let color = Colors.scaryCherry;
    if (subtle && ! this.state.hover) {
      color = Colors.reassuringGray;
    }
    return <Button
      backgroundColor={color}
      iconName={iconName || "close"}
      onMouseEnter={this.hover}
      onMouseLeave={this.unhover}
      {...leftoverProps}
    />;
  }
});

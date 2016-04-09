import React from "react";

import Button from "/imports/ui/client/components/Button/Button";

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
    let classes = "inactive";
    if (this.state.hover) {
      classes = "danger";
    }
    return <Button
      className={classes}
      label={this.props.label}
      iconName={this.props.iconName}
      onTouchTap={this.props.onTouchTap}
      onMouseEnter={this.hover}
      onMouseLeave={this.unhover}
    />;
  }
});

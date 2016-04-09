import React from "react";

import Button from "/imports/ui/client/components/Button/Button";

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
      return <Button
        label={this.props.labelActivate}
        primary={true}
        iconName={this.props.iconActivate}
        style={{ width: this.props.width }}
        onTouchTap={this.props.activate}
      />;
    } else {
      let classes = "inactive";
      let label;
      let icon;
      if (this.state.notHover) {
        label = this.props.labelActivated;
        icon = this.props.iconActivated;
      } else {
        if (this.props.dangerous) {
          classes = "danger";
        }
        label = this.props.labelDeactivate;
        icon = this.props.iconDeactivate;
      }
      return <Button
        className={classes}
        label={label}
        iconName={icon}
        style={{ width: this.props.width }}
        onTouchTap={this.props.deactivate}
        onMouseEnter={this.hoverOn}
        onMouseLeave={this.hoverOff}
      />;
    }
  }
});

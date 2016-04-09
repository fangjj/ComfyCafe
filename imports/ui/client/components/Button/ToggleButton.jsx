import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
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
        className={this.props.className}
        label={this.props.labelActivate}
        primary={true}
        iconName={this.props.iconActivate}
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
      classes = classConcat(classes, this.props.className);
      return <Button
        className={classes}
        label={label}
        iconName={icon}
        onTouchTap={this.props.deactivate}
        onMouseEnter={this.hoverOn}
        onMouseLeave={this.hoverOff}
      />;
    }
  }
});

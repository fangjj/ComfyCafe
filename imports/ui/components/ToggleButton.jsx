import React from "react";

import {
  RaisedButton,
  FontIcon
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
        secondary={true}
        icon={<FontIcon className="material-icons">{this.props.iconActivate}</FontIcon>}
        style={{width: this.props.width}}
        onTouchTap={this.props.activate}
      />;
    } else {
      let classes = "grey darken-2";
      let label;
      let icon;
      if (this.state.notHover) {
        label = this.props.labelActivated;
        icon = this.props.iconActivated;
      } else {
        if (this.props.dangerous) {
          classes = "red darken-3";
        }
        label = this.props.labelDeactivate;
        icon = this.props.iconDeactivate;
      }
      return <RaisedButton
        className={classes}
        label={label}
        labelStyle={{fontSize: "18px"}}
        icon={<FontIcon className="material-icons">{icon}</FontIcon>}
        style={{width: this.props.width}}
        onTouchTap={this.props.deactivate}
        onMouseEnter={this.hoverOn}
        onMouseLeave={this.hoverOff}
      />;
    }
  }
});

export default ToggleButton;

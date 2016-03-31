import React from "react";

import Icon from "./Icon";

import {
  RaisedButton
} from "material-ui";

const DangerButton = React.createClass({
  render() {
    return <RaisedButton
      className="red darken-3"
      label={this.props.label}
      labelStyle={{fontSize: "18px"}}
      icon={<Icon>{this.props.iconName}</Icon>}
      onTouchTap={this.props.onTouchTap}
    />
  }
});

export default DangerButton;

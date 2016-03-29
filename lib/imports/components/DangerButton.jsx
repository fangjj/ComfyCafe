import React from "react";

import {
  RaisedButton,
  FontIcon
} from "material-ui";

const DangerButton = React.createClass({
  render() {
    return <RaisedButton
      className="red darken-3"
      label={this.props.label}
      labelStyle={{fontSize: "18px"}}
      icon={<FontIcon className="material-icons">{this.props.iconName}</FontIcon>}
      onTouchTap={this.props.onTouchTap}
    />
  }
});

export default DangerButton;

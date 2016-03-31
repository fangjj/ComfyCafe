import React from "react";

import Icon from "./Icon";

import {
  RaisedButton
} from "material-ui";

const CancelButton = React.createClass({
  render() {
    return <RaisedButton
      className="grey darken-2"
      label={this.props.label || "Cancel"}
      labelStyle={{fontSize: "18px"}}
      icon={<Icon>{this.props.iconName || "cancel"}</Icon>}
      onTouchTap={this.props.onTouchTap}
    />
  }
});

export default CancelButton;

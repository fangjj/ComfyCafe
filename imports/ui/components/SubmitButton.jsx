import React from "react";

import Icon from "./Icon";

import {
  RaisedButton
} from "material-ui";

const SubmitButton = React.createClass({
  render() {
    return <RaisedButton
      label={this.props.label || "Submit"}
      labelStyle={{fontSize: "18px"}}
      secondary={true}
      icon={<Icon>{this.props.iconName || "done"}</Icon>}
      style={this.props.style}
      onTouchTap={this.props.onTouchTap}
    />;
  }
});

export default SubmitButton;

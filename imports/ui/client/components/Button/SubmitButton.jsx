import React from "react";

import Icon from "/imports/ui/client/components/Daikon/Icon";

import {
  RaisedButton
} from "material-ui";

const SubmitButton = React.createClass({
  render() {
    return <RaisedButton
      type={this.props.type}
      label={this.props.label || "Submit"}
      labelStyle={{fontSize: "18px"}}
      primary={true}
      icon={<Icon>{this.props.iconName || "done"}</Icon>}
      width={this.props.width}
      style={this.props.style}
      onTouchTap={this.props.onTouchTap}
    />;
  }
});

export default SubmitButton;

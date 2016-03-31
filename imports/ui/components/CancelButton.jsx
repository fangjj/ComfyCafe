import React from "react";

import Colors from "/imports/ui/colors";
import Icon from "./Icon";

import {
  RaisedButton
} from "material-ui";

const CancelButton = React.createClass({
  render() {
    return <RaisedButton
      backgroundColor={Colors.reassuringGray}
      label={this.props.label || "Cancel"}
      labelStyle={{fontSize: "18px"}}
      icon={<Icon>{this.props.iconName || "cancel"}</Icon>}
      onTouchTap={this.props.onTouchTap}
    />
  }
});

export default CancelButton;

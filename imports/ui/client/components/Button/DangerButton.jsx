import React from "react";

import Colors from "/imports/ui/client/utils/colors";
import Icon from "/imports/ui/client/components/Daikon/Icon";

import {
  RaisedButton
} from "material-ui";

const DangerButton = React.createClass({
  render() {
    return <RaisedButton
      className={Colors.scaryCherry}
      label={this.props.label}
      labelStyle={{fontSize: "18px"}}
      icon={<Icon>{this.props.iconName}</Icon>}
      onTouchTap={this.props.onTouchTap}
    />
  }
});

export default DangerButton;

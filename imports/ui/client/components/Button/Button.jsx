import React from "react";

import Icon from "/imports/ui/client/components/Daikon/Icon";

import {
  RaisedButton
} from "material-ui";

export default React.createClass({
  render() {
    return <RaisedButton
      type={this.props.type}
      label={this.props.label}
      labelStyle={{fontSize: "18px"}}
      primary={true}
      icon={<Icon>{this.props.iconName}</Icon>}
      width={this.props.width}
      style={this.props.style}
      onTouchTap={this.props.onTouchTap}
    />;
  }
});

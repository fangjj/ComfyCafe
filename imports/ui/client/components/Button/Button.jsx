import _ from "lodash";
import React from "react";
import RaisedButton from "material-ui/lib/raised-button";
import tinycolor from "tinycolor2";

import Colors from "/imports/ui/client/utils/colors";
import classConcat from "/imports/ui/client/utils/classConcat";
import Icon from "/imports/ui/client/components/Daikon/Icon";

export default React.createClass({
  getInitialState() {
    return {
      hover: false
    };
  },
  hover() {
    this.setState({ hover: true });
  },
  unhover() {
    this.setState({ hover: false });
  },
  render() {
    const {
      backgroundColor,
      primary,
      className,
      iconName,
      label,
      downStyle,
      width,
      ...leftoverProps
    } = this.props;

    const classes = classConcat("button", className);
    const style = _.defaults({ width: width }, downStyle);

    let color = backgroundColor || Colors.friendlyTeal;
    if (this.state.hover) {
      color = tinycolor(color).lighten(6).toHexString();
    }

    return <RaisedButton
      backgroundColor={color}
      className={classes}
      label={label}
      labelStyle={{ fontSize: "18px" }}
      icon={<Icon>{iconName}</Icon>}
      style={style}
      onMouseEnter={this.hover}
      onMouseLeave={this.unhover}
      {...leftoverProps}
    />;
  }
});

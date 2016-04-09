import _ from "lodash";
import React from "react";
import RaisedButton from "material-ui/lib/raised-button";

import classConcat from "/imports/ui/client/utils/classConcat";
import Icon from "/imports/ui/client/components/Daikon/Icon";

export default (props) => {
  const {
    className,
    iconName,
    label,
    downStyle,
    width,
    ...leftoverProps
  } = props;

  const classes = classConcat("button", className);
  const style = _.defaults({ width: width }, downStyle);
  return <RaisedButton
    className={classes}
    label={label}
    labelStyle={{ fontSize: "18px" }}
    icon={<Icon>{iconName}</Icon>}
    style={style}
    {...leftoverProps}
  />;
};

import _ from "lodash";
import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
import Icon from "/imports/ui/client/components/Daikon/Icon";

export default (props) => {
  const { className, iconName, ...leftoverProps } = props;
  const classes = classConcat("button", className);
  return <button className={classes} {...leftoverProps}>
    <Icon>{iconName}</Icon>
    <div className="label">
      {props.label}
    </div>
  </button>;
};

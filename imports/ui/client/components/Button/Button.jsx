import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import Ripple from "/imports/ui/client/components/Ripple";

export default (props) => {
  const { className, iconName, ...leftoverProps } = props;
  const classes = classConcat("button", className);
  return <button className={classes} {...leftoverProps}>
    <Ripple>
      <Icon>{iconName}</Icon>
      <div className="label">
        {props.label}
      </div>
    </Ripple>
  </button>;
};

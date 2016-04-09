import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import Ripple from "/imports/ui/client/components/Ripple";

export default (props) => {
  const { className, iconName, children, ...leftProps } = props;
  const classes = classConcat("fab", className);
  return <div className="fab-container">
    <button className={classes} {...leftProps}>
      <Ripple>
        <Icon>{iconName}</Icon>
      </Ripple>
    </button>
    {children}
  </div>;
};

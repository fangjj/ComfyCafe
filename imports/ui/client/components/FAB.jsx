import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
import Icon from "/imports/ui/client/components/Daikon/Icon";

export default (props) => {
  const { className, iconName, children, ...leftProps } = props;
  const classes = classConcat("fab", className);
  return <div className="fab-container">
    <button className={classes} {...leftProps}>
      <Icon>{iconName}</Icon>
    </button>
    {children}
  </div>;
};

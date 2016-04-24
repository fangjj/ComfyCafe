import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";

export default (props) => {
  const { className, children, ...leftoverProps } = props;
  const classes = classConcat("infoBox", className);
  return <div className={classes} {...leftoverProps}>
    {children}
  </div>;
};

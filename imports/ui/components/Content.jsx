import React from "react";

import classConcat from "/imports/ui/utils/classConcat";

export default (props) => {
  const { className, children, ...leftoverProps } = props;
  const classes = classConcat("content", className);
  return <div className={classes} {...leftoverProps}>
    {children}
  </div>;
};

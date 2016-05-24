import React from "react";

import classConcat from "/imports/ui/utils/classConcat";

export default (props) => {
  const { className, children, ...leftProps } = props;
  const classes = classConcat("material-icons", className);
  return <i className={classes} {...leftProps}>
    {children}
  </i>;
};

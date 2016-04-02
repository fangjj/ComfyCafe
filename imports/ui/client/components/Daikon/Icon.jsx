import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";

const Icon = (props) => {
  const { className, children, ...leftProps } = props;
  const classes = classConcat("material-icons", className);
  return <i className={classes} {...leftProps}>
    {children}
  </i>;
};

export default Icon;

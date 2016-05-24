import React from "react";

import classConcat from "/imports/ui/utils/classConcat"

const Error = (props) => {
  const { className, children, ...leftovers } = props;
  const classes = classConcat("errorBox", className);
  return <div className={classes} {...leftovers}>
    {children}
  </div>;
};

export default Error;

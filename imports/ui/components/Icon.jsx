import React from "react";

import classConcat from "/imports/api/common/classConcat";

import {
  FontIcon
} from "material-ui";

const Icon = (props) => {
  const { className, children, ...leftProps } = props;
  const classes = classConcat("material-icons", className);
  return <FontIcon className={classes} {...leftProps}>
    {children}
  </FontIcon>;
};

export default Icon;

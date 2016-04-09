import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";

export default (props) => {
  const { className, ordered, children, ...leftoverProps } = props;
  const classes = classConcat("list", className);
  let tag = "ul";
  if (ordered) {
    tag = "ol";
  }
  return <tag className={classes} {...leftoverProps}>
    {children}
  </tag>;
};

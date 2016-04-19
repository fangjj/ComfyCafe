import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";

export default (props) => {
  const { className, filter, ...leftoverProps } = props;
  const classes = classConcat(className, "filter-" + filter || "none");
  return <img className={classes} {...leftoverProps} />;
};

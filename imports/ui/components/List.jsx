import React from "react";

import classConcat from "/imports/ui/utils/classConcat";

export default (props) => {
  const { className, ordered, children, ...leftoverProps } = props;
  const classes = classConcat("list", className);
  if (ordered) {
    return <ol className={classes} {...leftoverProps}>
      {children}
    </ol>;
  } else {
    return <ul className={classes} {...leftoverProps}>
      {children}
    </ul>;
  }
};

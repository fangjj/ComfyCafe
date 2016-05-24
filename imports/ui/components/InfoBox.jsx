import React from "react";

import classConcat from "/imports/ui/utils/classConcat";

export default (props) => {
  const { className, section, children, ...leftoverProps } = props;
  const classes = classConcat("infoBox", className);
  if (section) {
    return <section className={classes} {...leftoverProps}>
      {children}
    </section>;
  } else {
    return <div className={classes} {...leftoverProps}>
      {children}
    </div>;
  }
};

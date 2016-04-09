import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
import Button from "/imports/ui/client/components/Button/Button";

export default (props) => {
  const { className, label, iconName, ...leftoverProps } = props;
  const classes = classConcat("submit", className);
  return <Button
    className={classes}
    label={label || "Submit"}
    iconName={iconName || "done"}
    {...leftoverProps}
  />;
};

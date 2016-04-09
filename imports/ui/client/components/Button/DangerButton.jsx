import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
import Button from "/imports/ui/client/components/Button/Button";

export default (props) => {
  const { className, iconName, ...leftoverProps } = props;
  let classes = "danger";
  if (props.subtle) {
    classes = "subtle " + classes;
  }
  classes = classConcat(classes, className);
  return <Button
    className={classes}
    iconName={iconName || "close"}
    {...leftoverProps}
  />;
};

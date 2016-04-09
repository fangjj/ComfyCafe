import React from "react";

import Button from "/imports/ui/client/components/Button/Button";

export default (props) => {
  console.error("[WARNING] SubtleDangerButton is deprecated. Use DangerButton with subtle={true}.");
  return <Button
    className="subtle danger"
    label={props.label}
    iconName={props.iconName}
    onTouchTap={props.onTouchTap}
  />;
};

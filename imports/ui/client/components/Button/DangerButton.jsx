import React from "react";

import Button from "/imports/ui/client/components/Button/Button";

export default (props) => {
  console.error("[WARNING] DangerButton is deprecated. Use Button directly instead!");
  return <Button
    className="danger"
    label={props.label}
    iconName={props.iconName}
    onTouchTap={props.onTouchTap}
  />;
};

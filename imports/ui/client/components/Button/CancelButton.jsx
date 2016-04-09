import React from "react";

import Button from "/imports/ui/client/components/Button/Button";

export default (props) => {
  console.error("[WARNING] CancelButton is deprecated. Use Button directly instead!");
  return <Button
    className="cancel"
    label={props.label || "Cancel"}
    iconName={props.iconName || "cancel"}
    onTouchTap={props.onTouchTap}
  />;
};

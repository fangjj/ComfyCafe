import React from "react";

import Button from "/imports/ui/client/components/Button/Button";

export default (props) => {
  console.error("[WARNING] SubmitButton is deprecated. Use Button directly instead!");
  return <Button
    type={props.type}
    label={props.label || "Submit"}
    primary={true}
    iconName={props.iconName || "done"}
    width={props.width}
    style={props.style}
    onTouchTap={props.onTouchTap}
  />;
};

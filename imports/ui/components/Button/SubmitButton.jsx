import React from "react";

import Button from "/imports/ui/components/Button/Button";

export default (props) => {
  const { label, iconName, ...leftoverProps } = props;
  return <Button
    label={label || "Submit"}
    iconName={iconName || "done"}
    primary={true}
    {...leftoverProps}
  />;
};

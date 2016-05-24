import React from "react";
import Toggle from "material-ui/Toggle";

export default (props) => {
  const { value, onChange, ...leftoverProps } = props;
  return <Toggle
    labelPosition="right"
    defaultToggled={value}
    onToggle={onChange}
    {...leftoverProps}
  />;
};

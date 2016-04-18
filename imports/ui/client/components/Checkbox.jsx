import React from "react";
import Checkbox from "material-ui/Checkbox";

export default (props) => {
  const { ...leftoverProps } = props;

  return <Checkbox
    labelStyle={{ fontSize: "20px" }}
    {...leftoverProps}
  />;
};

import React from "react";

import TextField from "./TextField";

export default (props) => {
  const { ...leftoverProps } = props;

  return <TextField
    multiLine={true}
    {...leftoverProps}
  />;
};

import React from "react";
import TextField from "material-ui/TextField";

export default (props) => {
  const { label, ...leftoverProps } = props;

  return <TextField
    floatingLabelText={label}
    floatingLabelStyle={{ fontSize: "20px" }}
    fullWidth={true}
    {...leftoverProps}
  />;
};

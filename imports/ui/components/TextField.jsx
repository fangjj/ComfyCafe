import React from "react";
import TextField from "material-ui/TextField";

import Colors from "/imports/ui/utils/colors"

export default (props) => {
  const { label, ...leftoverProps } = props;

  return <TextField
    floatingLabelText={label}
    floatingLabelStyle={{ fontSize: "20px" }}
    errorStyle={{
      fontSize: "16px",
      color: Colors.poisonPink
    }}
    fullWidth={true}
    {...leftoverProps}
  />;
};

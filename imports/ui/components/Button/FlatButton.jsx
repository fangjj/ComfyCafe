import _ from "lodash";
import React from "react";
import FlatButton from "material-ui/FlatButton";

export default (props) => {
  return <FlatButton
    labelStyle={{ fontSize: "18px" }}
    {...props}
  />;
};

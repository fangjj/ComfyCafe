import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
import Scrollable from "./Scrollable";

export default (props) => {
  const classes = classConcat("col", props.className);
  return <Scrollable className={classes}>
    {props.children}
  </Scrollable>;
};

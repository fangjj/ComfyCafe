import React from "react";

import classConcat from "/imports/ui/utils/classConcat";
import Scrollable from "./Scrollable";

export default (props) => {
  const classes = classConcat("col", props.className);
  return <Scrollable className={classes}>
    {props.children}
  </Scrollable>;
};

import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";

export default (props) => {
  const classes = classConcat("visibility", props.visibility);
  return <a href={props.href} className={classes}>
    {props.children}
  </a>;
};

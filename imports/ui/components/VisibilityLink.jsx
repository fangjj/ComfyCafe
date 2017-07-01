import React from "react";

import classConcat from "/imports/ui/utils/classConcat";
import publishedMap from "/imports/ui/utils/publishedMap";

export default (props) => {
  const classes = classConcat("visibility", publishedMap(props.published));
  return <a href={props.href} className={classes}>
    {props.children}
  </a>;
};

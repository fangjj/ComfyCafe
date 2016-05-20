import _ from "lodash";
import React from "react";

export default (props) => {
  return <div className="toolbar">
    {props.children}
  </div>;
};

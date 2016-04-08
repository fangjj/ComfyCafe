import React from "react";

import {
  LinearProgress
} from "material-ui";

export default (props) => {
  const { mode, ...leftoverProps } = props;
  return <LinearProgress
    mode={mode || "determinate"}
    {...leftoverProps}
  />;
};

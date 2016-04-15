import React from "react";
import TouchRipple from "material-ui/internal/TouchRipple";

import muiTheme from "/imports/ui/client/utils/muiTheme";

export default (props) => {
  return <TouchRipple muiTheme={muiTheme}>
    {props.children}
  </TouchRipple>;
};

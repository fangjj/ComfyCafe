import React from "react";
import TouchRipple from "material-ui/lib/ripples/touch-ripple";

import muiTheme from "/imports/ui/client/utils/muiTheme";

export default (props) => {
  return <TouchRipple muiTheme={muiTheme}>
    {props.children}
  </TouchRipple>;
};

import React from "react";
import FocusRipple from "material-ui/lib/ripples/focus-ripple";

import muiTheme from "/imports/ui/client/utils/muiTheme";

export default (props) => {
  return <FocusRipple muiTheme={muiTheme} {...props} />;
};

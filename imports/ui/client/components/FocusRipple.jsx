import React from "react";
import FocusRipple from "material-ui/internal/FocusRipple";

import muiTheme from "/imports/ui/client/utils/muiTheme";

export default (props) => {
  return <FocusRipple muiTheme={muiTheme} {...props} />;
};

import React from "react";

import {
  FontIcon
} from "material-ui";

const Icon = React.createClass({
  render() {
    const { className, children, ...props } = this.props;
    const classes = classConcat("material-icons", className);
    return <FontIcon className={classes} {...props}>
      {children}
    </FontIcon>;
  }
});

export default Icon;

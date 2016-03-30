import React from "react";

import classConcat from "/imports/api/common/classConcat";

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

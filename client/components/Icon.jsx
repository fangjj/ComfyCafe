import React from "react";

let {
  FontIcon
} = mui;

Icon = React.createClass({
  render() {
    const { className, children, ...props } = this.props;
    const classes = classConcat("material-icons", className);
    return <FontIcon className={classes} {...props}>
      {children}
    </FontIcon>;
  }
});

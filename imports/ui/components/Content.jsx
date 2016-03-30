import React from "react";

const Content = React.createClass({
  render() {
    const { className, children, ...props } = this.props;
    const classes = classConcat("content", className);
    return <div className={classes} {...props}>
      {children}
    </div>;
  }
});

export default Content;

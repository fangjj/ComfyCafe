import React from "react";

const Actions = React.createClass({
  render() {
    const { className, children, ...props } = this.props;
    const classes = classConcat("actions", className);
    return <div className={classes} {...props}>
      <div>
        {children}
      </div>
    </div>;
  }
});

export default Actions;

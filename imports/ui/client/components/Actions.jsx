import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";

const Actions = React.createClass({
  renderLeft(left) {
    return <div className="left">
      {left}
    </div>;
  },
  render() {
    const { className, children, left, ...props } = this.props;
    const classes = classConcat("actions", className);
    return <div className={classes} {...props}>
      {this.renderLeft(left)}
      <div>
        {children}
      </div>
    </div>;
  }
});

export default Actions;

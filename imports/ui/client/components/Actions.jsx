import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
import ButtonGroup from "/imports/ui/client/components/Button/ButtonGroup";

export default React.createClass({
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
      <ButtonGroup>
        {children}
      </ButtonGroup>
    </div>;
  }
});

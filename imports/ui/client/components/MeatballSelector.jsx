import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";

export default React.createClass({
  renderInner() {
    return this.props.children.map((child) => {
      return React.cloneElement(child, {
        value: this.props.value,
        onTouchTap: this.props.onChange,
        key: child.props.name
      });
    });
  },
  render() {
    const classes = classConcat("meatballSelector", this.props.className);
    return <div className={classes}>
      {this.renderInner()}
    </div>;
  }
});

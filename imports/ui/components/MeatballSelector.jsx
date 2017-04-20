import React from "react";

import classConcat from "/imports/ui/utils/classConcat";

export default React.createClass({
  renderInner() {
    return this.props.children.map((child) => {
      return React.cloneElement(child, {
        value: this.props.value,
        onClick: this.props.onChange,
        key: child.props.name
      });
    });
  },
  render() {
    const classes = classConcat("meatballSelector", this.props.className);
    return <div className={classes}>
      <header>
        <h3>{this.props.label}</h3>
      </header>
      <div className="inner">
        {this.renderInner()}
      </div>
    </div>;
  }
});

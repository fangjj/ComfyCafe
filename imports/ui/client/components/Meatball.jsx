import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";

export default React.createClass({
  handleTouch() {
    this.props.onTouchTap(this.props.name);
  },
  render() {
    const active = this.props.value === this.props.name;
    let classes = classConcat("meatball", this.props.className);
    if (active) {
      classes = classConcat(classes, "active");
    }
    return <div className={classes} onTouchTap={this.handleTouch}>
      <div className="iconContainer">
        {this.props.icon}
      </div>
      <div className="label">
        {this.props.label}
      </div>
      {this.props.children}
    </div>;
  }
});

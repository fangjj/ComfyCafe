import React from "react";

import classConcat from "/imports/ui/utils/classConcat";

export default React.createClass({
  handleTouch() {
    this.props.onClick(this.props.name);
  },
  renderIcon() {
    if (this.props.icon) {
      return <div className="iconContainer">
        {this.props.icon}
      </div>;
    }
  },
  renderLabel() {
    if (this.props.label) {
      return <div className="label">
        {this.props.label}
      </div>;
    }
  },
  render() {
    const active = this.props.value === this.props.name;
    let classes = classConcat("meatball", this.props.className);
    if (active) {
      classes = classConcat(classes, "active");
    }
    const style = {};
    if (this.props.color) {
      style.backgroundColor = this.props.color;
    }
    return <div className={classes} style={style} onClick={this.handleTouch}>
      {this.renderIcon()}
      {this.renderLabel()}
      {this.props.children}
    </div>;
  }
});

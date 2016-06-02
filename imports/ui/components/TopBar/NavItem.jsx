import React from "react";

import classConcat from "/imports/ui/utils/classConcat";
import Icon from "/imports/ui/components/Daikon/Icon";
import Ripple from "/imports/ui/components/Ripple";

export default React.createClass({
  renderIcon() {
    if (this.props.iconName) {
      return <Icon>{this.props.iconName}</Icon>;
    }
  },
  renderLabel() {
    if (this.props.label) {
      return <div className="label hide-on-med-and-down">{this.props.label}</div>;
    }
  },
  renderInner() {
    if (this.props.children) {
      return this.props.children;
    } else {
      return <a href={this.props.href}>
        <Ripple>
          {this.renderIcon()}
          {this.renderLabel()}
        </Ripple>
      </a>;
    }
  },
  render() {
    const classes = classConcat("navItem", this.props.className);
    return <li id={this.props.id} className={classes}>
      {this.renderInner()}
    </li>;
  }
});

import React from "react";

import Icon from "/imports/ui/client/components/Daikon/Icon";

const NavItem = React.createClass({
  renderIcon() {
    if (this.props.iconName) {
      const classes = (this.props.label ? "left" : undefined);
      return <Icon className={classes}>{this.props.iconName}</Icon>;
    }
  },
  renderLabel() {
    if (this.props.label) {
      return <span className="hide-on-med-and-down">{this.props.label}</span>;
    }
  },
  renderInner() {
    if (this.props.children) {
      return this.props.children;
    } else {
      return <a href={this.props.href} className="waves-effect waves-teal">
        {this.renderIcon()}
        {this.renderLabel()}
      </a>;
    }
  },
  render() {
    var classes = "navItem";
    if (this.props.className) {
      classes += " " + this.props.className;
    }

    return <li id={this.props.id} className={classes}>
      {this.renderInner()}
    </li>;
  }
});

export default NavItem;

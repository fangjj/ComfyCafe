import React from "react";

const NavItem = React.createClass({
  renderIcon() {
    if (this.props.iconName) {
      let classes = "material-icons";
      if (this.props.label) {
        classes += " left";
      }
      return <i className={classes}>{this.props.iconName}</i>;
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

    return <li className={classes}>
      {this.renderInner()}
    </li>;
  }
});

export default NavItem;

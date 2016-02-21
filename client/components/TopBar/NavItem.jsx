NavItem = React.createClass({
  getInitialState() {
    return {
      muiTheme: this.context.muiTheme || mui.Styles.getMuiTheme(),
      hovered: false
    };
  },
  handleMouseEnter () {
    //if (! this.state.touch) {
      this.setState({hovered: true});
    //}
  },
  handleMouseLeave () {
    this.setState({hovered: false});
  },
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
    const textColor = this.state.muiTheme.rawTheme.palette.textColor;
    const hoverColor = mui.Utils.ColorManipulator.fade(textColor, 0.1);

    var style = {
      transition: mui.Styles.Transitions.easeOut()
    };
    if (this.state.hovered) {
      style.backgroundColor = hoverColor;
    }

    var classes = "navItem";
    if (this.props.className) {
      classes += " " + this.props.className;
    }

    return <li
        className={classes}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={style}
      >
        {this.renderInner()}
    </li>;
  }
});

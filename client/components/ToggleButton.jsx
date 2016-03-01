let {
  RaisedButton,
  FontIcon
} = mui;

ToggleButton = React.createClass({
  getInitialState() {
    return {
      notHover: true
    };
  },
  hoverOn() {
    this.setState({notHover: false});
  },
  hoverOff() {
    this.setState({notHover: true});
  },
  render() {
    if (! this.props.active) {
      return <RaisedButton
        label={this.props.labelActivate}
        labelStyle={{fontSize: "18px"}}
        secondary={true}
        icon={<FontIcon className="material-icons">{this.props.iconActivate}</FontIcon>}
        style={{width: this.props.width}}
        onTouchTap={this.props.activate}
      />;
    } else {
      let label;
      let icon;
      if (this.state.notHover) {
        label = this.props.labelActivated;
        icon = this.props.iconActivated;
      } else {
        label = this.props.labelDeactivate;
        icon = this.props.iconDeactivate;
      }
      return <RaisedButton
        className="grey darken-2"
        label={label}
        labelStyle={{fontSize: "18px"}}
        icon={<FontIcon className="material-icons">{icon}</FontIcon>}
        style={{width: this.props.width}}
        onTouchTap={this.props.deactivate}
        onMouseEnter={this.hoverOn}
        onMouseLeave={this.hoverOff}
      />;
    }
  }
});

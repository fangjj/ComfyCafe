let {
  RaisedButton,
  FontIcon
} = mui;

DangerButton = React.createClass({
  render() {
    return <RaisedButton
      className="red darken-3"
      label={this.props.label}
      icon={<FontIcon className="material-icons">{this.props.iconName}</FontIcon>}
      onTouchTap={this.props.onTouchTap}
    />
  }
});

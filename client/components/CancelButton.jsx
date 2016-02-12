let {
  RaisedButton,
  FontIcon
} = mui;

CancelButton = React.createClass({
  render() {
    return <RaisedButton
      className="grey darken-2"
      label={this.props.label || "Cancel"}
      icon={<FontIcon className="material-icons">{this.props.iconName || "cancel"}</FontIcon>}
      onTouchTap={this.props.onTouchTap}
    />
  }
});

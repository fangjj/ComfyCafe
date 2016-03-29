import React from "react";

let {
  RaisedButton,
  FontIcon
} = mui;

SubmitButton = React.createClass({
  render() {
    return <RaisedButton
      label={this.props.label || "Submit"}
      labelStyle={{fontSize: "18px"}}
      secondary={true}
      icon={<FontIcon className="material-icons">{this.props.iconName || "done"}</FontIcon>}
      style={this.props.style}
      onTouchTap={this.props.onTouchTap}
    />;
  }
});

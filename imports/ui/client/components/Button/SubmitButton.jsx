import React from "react";

import Button from "/imports/ui/client/components/Button/Button";

export default React.createClass({
  render() {
    return <Button
      type={this.props.type}
      label={this.props.label || "Submit"}
      primary={true}
      iconName={this.props.iconName || "done"}
      width={this.props.width}
      style={this.props.style}
      onTouchTap={this.props.onTouchTap}
    />;
  }
});

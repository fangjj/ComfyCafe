import React from "react";

import Toggle from "/imports/ui/components/Toggle";

export default React.createClass({
  render() {
    return <div className="selector">
      <Toggle
        label={this.props.label || "Visible to the public"}
        value={this.props.value}
        onChange={this.props.onChange}
      />
    </div>;
  }
});

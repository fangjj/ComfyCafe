import React from "react";

import safetyLabels from "/imports/api/common/safetyLabels";
import Meatball from "/imports/ui/client/components/Meatball";
import MeatballSelector from "/imports/ui/client/components/MeatballSelector";

export default React.createClass({
  render() {
    return <MeatballSelector
      label={this.props.label || "Safety"}
      value={this.props.safety || this.props.value}
      defaultValue={this.props.defaultValue}
      onChange={this.props.onChange}
    >
      <Meatball name={0} label={safetyLabels[0]} />
      <Meatball name={1} label={safetyLabels[1]} />
      <Meatball name={2} label={safetyLabels[2]} />
      <Meatball name={3} label={safetyLabels[3]} />
    </MeatballSelector>;
  }
});

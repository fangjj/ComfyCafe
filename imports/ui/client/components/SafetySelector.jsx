import React from "react";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

import safetyLabels from "/imports/api/common/safetyLabels";

export default React.createClass({
  render() {
    return <SelectField
      floatingLabelText={this.props.label || "Safety"}
      floatingLabelStyle={{ fontSize: "20px" }}
      value={this.props.safety || this.props.value}
      defaultValue={this.props.defaultValue}
      onChange={this.props.onChange}
      fullWidth={true}
    >
      <MenuItem value={0} primaryText={safetyLabels[0]} />
      <MenuItem value={1} primaryText={safetyLabels[1]} />
      <MenuItem value={2} primaryText={safetyLabels[2]} />
      <MenuItem value={3} primaryText={safetyLabels[3]} />
    </SelectField>;
  }
});

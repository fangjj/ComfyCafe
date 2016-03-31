import React from "react";

import safetyLabels from "/imports/api/common/safetyLabels";

import {
  SelectField,
  MenuItem
} from "material-ui";

const SafetySelector = React.createClass({
  render() {
    return <SelectField
      value={this.props.safety}
      onChange={this.props.onChange}
      fullWidth={true}
      floatingLabelText="Safety"
      floatingLabelStyle={{fontSize: "20px"}}
    >
      <MenuItem value={0} primaryText={safetyLabels[0]} />
      <MenuItem value={1} primaryText={safetyLabels[1]} />
      <MenuItem value={2} primaryText={safetyLabels[2]} />
      <MenuItem value={3} primaryText={safetyLabels[3]} />
    </SelectField>;
  }
});

export default SafetySelector;

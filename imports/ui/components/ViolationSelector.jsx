import React from "react";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

import violationMap from "/imports/api/common/violationMap";

export default React.createClass({
  renderItems() {
    const itemStyle = { fontSize: "17px" };
    return _.map(violationMap, (value, key) => {
      return <MenuItem value={key} primaryText={value} style={itemStyle} key={key} />;
    });
  },
  render() {
    return <SelectField
      value={this.props.value}
      onChange={this.props.onChange}
      fullWidth={true}
      floatingLabelText={this.props.label || "Violation"}
      floatingLabelStyle={{ fontSize: "20px" }}
    >
      {this.renderItems()}
    </SelectField>;
  }
});

import React from "react";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

export default React.createClass({
  render() {
    const itemStyle = { fontSize: "17px" };
    return <SelectField
      value={this.props.value}
      onChange={this.props.onChange}
      fullWidth={true}
      floatingLabelText={this.props.label || "Violation"}
      floatingLabelStyle={{ fontSize: "20px" }}
    >
      <MenuItem value="spam" primaryText="Spam" style={itemStyle} />
      <MenuItem value="copyright" primaryText="Copyright" style={itemStyle} />
      <MenuItem value="harassment" primaryText="Harassment" style={itemStyle} />
      <MenuItem value="fraud" primaryText="Fraudulent" style={itemStyle} />
      <MenuItem value="mistagged" primaryText="Intentionally Mistagged" style={itemStyle} />
      <MenuItem value="offtopic" primaryText="Off-Topic/Indecorum/Nongermane" style={itemStyle} />
      <MenuItem value="broken" primaryText="Broken" style={itemStyle} />
      <MenuItem value="illegal" primaryText="Illegal" style={itemStyle} />
      <MenuItem value="other" primaryText="Other" style={itemStyle} />
    </SelectField>;
  }
});

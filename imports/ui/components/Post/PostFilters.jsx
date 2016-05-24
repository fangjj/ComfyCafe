import _ from "lodash";
import React from "react";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

export default React.createClass({
  renderInner(filters) {
    return _.map(filters, (filter) => {
      return <MenuItem value={filter._id} primaryText={filter.name} key={filter._id} />;
    });
  },
  render() {
    return <SelectField
      id={this.props.id}
      value={this.props.value}
      onChange={this.props.onChange}
      fullWidth={true}
      floatingLabelText={this.props.floatingLabelText}
      floatingLabelStyle={{fontSize: "20px"}}
    >
      {this.renderInner(this.props.filters)}
    </SelectField>;
  }
});

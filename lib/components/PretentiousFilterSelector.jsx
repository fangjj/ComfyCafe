import React from "react";

import {
  SelectField,
  MenuItem
} from "material-ui";

// Note that this is for Instagram-esque filters, not query filters.
PretentiousFilterSelector = React.createClass({
  render() {
    return <div>
      <SelectField
        value={this.props.pretentiousFilter}
        onChange={this.props.onChange}
        fullWidth={true}
        floatingLabelText="Pretentious Filter"
        floatingLabelStyle={{fontSize: "20px"}}
      >
        <MenuItem value="none" primaryText="None" />
        <MenuItem value="xpro2" primaryText="X-PRO 2" />
        <MenuItem value="willow" primaryText="Willow" />
        <MenuItem value="valencia" primaryText="Valencia" />
        <MenuItem value="nashville" primaryText="Nashville" />
        <MenuItem value="kelvin" primaryText="Kelvin" />
        <MenuItem value="inkwell" primaryText="Inkwell" />
        <MenuItem value="earlybird" primaryText="Earlybird" />
        <MenuItem value="brannan" primaryText="Brannan" />
        <MenuItem value="1977" primaryText="1977" />
      </SelectField>
    </div>;
  }
});

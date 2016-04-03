import React from "react";

import {
  SelectField,
  MenuItem
} from "material-ui";

const OriginalitySelector = React.createClass({
  render() {
    return <SelectField
      value={this.props.value}
      onChange={this.props.onChange}
      fullWidth={true}
      floatingLabelText="Originality"
      floatingLabelStyle={{fontSize: "20px"}}
    >
      <MenuItem value="original" primaryText="Your work" />
      <MenuItem value="derivative" primaryText="Derivative work" />
      <MenuItem value="repost" primaryText="Repost" />
    </SelectField>;
  }
});

export default OriginalitySelector;

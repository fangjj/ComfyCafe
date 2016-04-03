import React from "react";

import {
  SelectField,
  MenuItem
} from "material-ui";

const SelectVisibility = React.createClass({
  render() {
    return <div>
      <SelectField
        value={this.props.visibility}
        onChange={this.props.onChange}
        fullWidth={true}
        floatingLabelText="Visibility"
        floatingLabelStyle={{fontSize: "20px"}}
      >
        <MenuItem value="public" primaryText="Public" />
        <MenuItem value="friends" primaryText="Friends" />
        <MenuItem value="unlisted" primaryText="Unlisted" />
      </SelectField>
    </div>;
  }
});

export default SelectVisibility;
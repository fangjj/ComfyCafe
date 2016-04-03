import React from "react";

import {
  SelectField,
  MenuItem
} from "material-ui";

const PostFilters = React.createClass({
  render() {
    return <SelectField
      value={this.props.value}
      onChange={this.props.onChange}
      fullWidth={true}
      floatingLabelText={this.props.floatingLabelText}
      floatingLabelStyle={{fontSize: "20px"}}
    >
      <MenuItem value="all" primaryText="Everything" />
      <MenuItem value="sfw" primaryText="SFW" />
      <MenuItem value="nsfw" primaryText="NSFW" />
      <MenuItem value="your" primaryText="Your Images" />
    </SelectField>;
  }
});

export default PostFilters;

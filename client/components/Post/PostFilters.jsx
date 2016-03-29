import React from "react";

let {
  SelectField,
  MenuItem
} = mui;

PostFilters = React.createClass({
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

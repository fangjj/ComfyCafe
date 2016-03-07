let {
  SelectField,
  MenuItem
} = mui;

PostFilters = React.createClass({
  render() {
    return <SelectField
      value={this.props.filter}
      onChange={this.props.onChange}
      fullWidth={true}
      floatingLabelStyle={{fontSize: "20px"}}
    >
      <MenuItem value="sfw" primaryText="SFW" />
      <MenuItem value="nsfw" primaryText="NSFW" />
      <MenuItem value="your" primaryText="Your Images" />
    </SelectField>;
  }
});

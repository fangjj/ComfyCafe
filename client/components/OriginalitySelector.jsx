let {
  SelectField,
  MenuItem
} = mui;

OriginalitySelector = React.createClass({
  render() {
    return <SelectField
      value={this.props.originality}
      onChange={this.props.onChange}
      fullWidth={true}
      floatingLabelText="Originality"
      floatingLabelStyle={{fontSize: "20px"}}
    >
      <MenuItem value="yours" primaryText="Your work" />
      <MenuItem value="derivative" primaryText="Derivative work" />
      <MenuItem value="repost" primaryText="Repost" />
    </SelectField>;
  }
});

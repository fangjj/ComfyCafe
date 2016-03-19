let {
  SelectField,
  MenuItem
} = mui;

SafetySelector = React.createClass({
  render() {
    return <SelectField
      value={this.props.safety}
      onChange={this.props.onChange}
      fullWidth={true}
      floatingLabelText="Safety"
      floatingLabelStyle={{fontSize: "20px"}}
    >
      <MenuItem value="safe" primaryText="Safe" />
      <MenuItem value="risqué" primaryText="Risqué" />
      <MenuItem value="nudity" primaryText="Nudity" />
      <MenuItem value="explicit" primaryText="Explicit" />
    </SelectField>;
  }
});

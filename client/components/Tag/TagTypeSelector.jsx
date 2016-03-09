let {
  SelectField,
  MenuItem
} = mui;

TagTypeSelector = React.createClass({
  render() {
    return <div>
      <SelectField
        value={this.props.tagType}
        onChange={this.props.onChange}
        fullWidth={true}
        floatingLabelText="Type"
        floatingLabelStyle={{fontSize: "20px"}}
      >
        <MenuItem value="generic" primaryText="Generic" />
        <MenuItem value="character" primaryText="Character" />
      </SelectField>
    </div>;
  }
});

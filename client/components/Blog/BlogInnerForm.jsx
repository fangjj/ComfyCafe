let {
  TextField,
  SelectField,
  MenuItem
} = mui;

BlogInnerForm = React.createClass({
  render() {
    return <div>
      <div>
        <SelectField
          value={this.props.visibility}
          onChange={this.props.handleVisibility}
          fullWidth={true}
        >
          <MenuItem value="public" primaryText="Public" />
          <MenuItem value="friends" primaryText="Friends" />
          <MenuItem value="unlisted" primaryText="Unlisted" />
        </SelectField>
      </div>
      <br />
      <TextField
        hintText="Body"
        defaultValue={this.props.body}
        floatingLabelText="Body"
        floatingLabelStyle={{fontSize: "20px"}}
        multiline={true}
        rows={4}
        onChange={this.props.handleBody}
        fullWidth={true}
      />
  </div>;
  }
});

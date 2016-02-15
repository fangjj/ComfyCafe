let {
  TextField,
  SelectField,
  MenuItem
} = mui;

PostInnerFormComponent = React.createClass({
  render() {
    return <form>
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
          hintText="Description"
          defaultValue={this.props.description}
          floatingLabelText="Description"
          floatingLabelStyle={{fontSize: "20px"}}
          multiline={true}
          rows={4}
          onChange={this.props.handleDescription}
          fullWidth={true}
        />
        <br />
        <TextField
          hintText="Tags"
          defaultValue={this.props.tags}
          floatingLabelText="Tags"
          floatingLabelStyle={{fontSize: "20px"}}
          multiline={true}
          rows={4}
          onChange={this.props.handleTags}
          fullWidth={true}
        />
    </form>;
  }
});

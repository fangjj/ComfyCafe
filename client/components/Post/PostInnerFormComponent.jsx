let {
  TextField,
  SelectField,
  MenuItem
} = mui;

PostInnerFormComponent = React.createClass({
  render() {
    return <form>
        <div>
          <SelectField value={this.props.visibility} onChange={this.props.handleVisibility}>
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
          multiline={true}
          rows={4}
          onChange={this.props.handleDescription}
        />
        <br />
        <TextField
          hintText="Tags"
          defaultValue={this.props.tags}
          floatingLabelText="Tags"
          multiline={true}
          rows={4}
          onChange={this.props.handleTags}
        />
    </form>;
  }
});

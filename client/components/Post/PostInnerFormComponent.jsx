let {
  TextField,
  Checkbox
} = mui;

PostInnerFormComponent = React.createClass({
  render() {
    return <div>
      <SelectVisibility
        visibility={this.props.visibility}
        onChange={this.props.handleVisibility}
      />
      <br />
      <Checkbox
        checked={this.props.original}
        label="Original content"
        labelStyle={{fontSize: "20px"}}
        onCheck={this.props.handleOriginal}
      />
      <TextField
        defaultValue={this.props.description}
        floatingLabelText="Description"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={3}
        rowsMax={7}
        onChange={this.props.handleDescription}
        fullWidth={true}
      />
      <br />
      <TextField
        defaultValue={this.props.tags}
        floatingLabelText="Tags"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={1}
        rowsMax={4}
        onChange={this.props.handleTags}
        fullWidth={true}
      />
  </div>;
  }
});

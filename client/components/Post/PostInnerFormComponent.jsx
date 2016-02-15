let {
  TextField
} = mui;

PostInnerFormComponent = React.createClass({
  render() {
    return <div>
      <SelectVisibility
        visibility={this.props.visibility}
        onChange={this.props.handleVisibility}
      />
      <br />
      <TextField
        hintText="Description"
        defaultValue={this.props.description}
        floatingLabelText="Description"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
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
        multiLine={true}
        rows={4}
        onChange={this.props.handleTags}
        fullWidth={true}
      />
  </div>;
  }
});

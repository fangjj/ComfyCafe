let {
  TextField,
  Checkbox,
  FlatButton
} = mui;

PostInnerForm = React.createClass({
  render() {
    return <div>
      <SelectVisibility
        visibility={this.props.visibility}
        onChange={this.props.handleVisibility}
      />
      <br />
      <Checkbox
        defaultChecked={this.props.original}
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
      <SafetySelector
        safety={this.props.safety}
        onChange={this.props.handleSafety}
      />
      <div className="autoSafety">
        <span className="label">
          Auto Safety: {safetyLabels[this.props.autoSafety]}
        </span>
        <FlatButton
          label="Apply"
          onTouchTap={this.props.applyAutoSafety}
        />
      </div>
      <TagField
        defaultValue={this.props.tags}
        condExpanded={this.props.condExpanded}
        floatingLabelText="Tags"
        onChange={this.props.handleTags}
        receiveAutoSafety={this.props.receiveAutoSafety}
      />
      <PretentiousFilterSelector
        pretentiousFilter={this.props.pretentiousFilter}
        onChange={this.props.handlePretentiousFilter}
      />
  </div>;
  }
});

let {
  TextField,
  SelectField,
  MenuItem
} = mui;

TagTest = React.createClass({
  getInitialState() {
    return {
      patchMode: "vanilla",
      tagStrA: "",
      tagStrB: "",
      tagStrC: ""
    };
  },
  handlePatchMode(event, index, value) {
    this.setState({
      patchMode: value
    });
  },
  handleA(value) {
    this.setState({
      tagStrA: value
    });
  },
  handleB(value) {
    this.setState({
      tagStrB: value
    });
  },
  handleC(value) {
    this.setState({
      tagStrC: value
    });
  },
  getPatcher() {
    return {
      vanilla: tagPatcher,
      syncImpl: tagPatcherSyncImpl,
      condImpl: tagPatcherCondImpl
    }[this.state.patchMode];
  },
  render() {
    return <div className="content">
      <SelectField
        value={this.state.patchMode}
        onChange={this.handlePatchMode}
        fullWidth={true}
        floatingLabelText="Patch Mode"
        floatingLabelStyle={{fontSize: "20px"}}
      >
        <MenuItem value="vanilla" primaryText="Vanilla" />
        <MenuItem value="syncImpl" primaryText="SyncImpl" />
        <MenuItem value="condImpl" primaryText="CondImpl" />
      </SelectField>
      <TagTree tags={this.getPatcher()(
        tagParser(this.state.tagStrA),
        tagParser(this.state.tagStrB),
        tagParser(this.state.tagStrC)
      )} />
      <TagField floatingLabelText="Tags A" onChange={this.handleA} />
      <TagField floatingLabelText="Tags B" onChange={this.handleB} />
      <TagField floatingLabelText="Tags C" onChange={this.handleC} />
    </div>;
  }
});

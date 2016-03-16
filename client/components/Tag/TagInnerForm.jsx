let {
  TextField
} = mui;

TagInnerForm = React.createClass({
  renderOrigin() {
    if (this.props.tagType !== "origin") {
      return <span>
        <TextField
          defaultValue={this.props.origin}
          floatingLabelText="Origin"
          floatingLabelStyle={{fontSize: "20px"}}
          onChange={this.props.handleOrigin}
          fullWidth={true}
        />
        <br />
      </span>;
    }
  },
  render() {
    return <div>
      <TextField
        defaultValue={this.props.name}
        floatingLabelText="Name"
        floatingLabelStyle={{fontSize: "20px"}}
        onChange={this.props.handleName}
        fullWidth={true}
      />
      <br />
      <TagTypeSelector
        tagType={this.props.tagType}
        onChange={this.props.handleTagType}
      />
      <TextField
        defaultValue={this.props.aliases}
        floatingLabelText="Aliases"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={1}
        rowsMax={3}
        onChange={this.props.handleAliases}
        fullWidth={true}
      />
      <br />
      {this.renderOrigin()}
      <TextField
        defaultValue={this.props.definition}
        floatingLabelText="Definition"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={3}
        rowsMax={10}
        onChange={this.props.handleDefinition}
        fullWidth={true}
      />
      <br />
      <TagField
        noExpand={true}
        injectRoot={this.props.name}
        defaultValue={this.props.implications}
        floatingLabelText="Implications"
        onChange={this.props.handleImplications}
      />
      <TagMultiField
        injectRoot={this.props.name}
        defaultValue={this.props.condImplications}
        defaultImplications={this.props.implications}
        floatingLabelText="Conditional Implications"
        onChange={this.props.handleCondImplications}
      />
  </div>;
  }
});

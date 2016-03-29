import React from "react";

let {
  TextField
} = mui;

TagInnerForm = React.createClass({
  renderOrigin() {
    if (! _.includes(["origin", "artist"], this.props.tagType)) {
      return <span>
        <TagInlineField
          constrainType="origin"
          defaultValue={this.props.origin}
          floatingLabelText="Origin"
          onChange={this.props.handleOrigin}
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
      <SafetySelector
        safety={this.props.safety}
        onChange={this.props.handleSafety}
      />
      <TagInlineField
        delim=","
        defaultValue={this.props.extends}
        floatingLabelText="Extends"
        onChange={this.props.handleExtends}
      />
      <TagField
        noExpand={true}
        injectRoot={this.props.name}
        defaultValue={this.props.implications}
        floatingLabelText="Implications"
        onChange={this.props.handleImplications}
      />
      <TagMultiField
        inheritFrom={this.props.inheritFrom}
        injectRoot={this.props.name}
        defaultValue={this.props.condImplications}
        defaultImplications={this.props.implications}
        floatingLabelText="Conditional Implications"
        onChange={this.props.handleCondImplications}
      />
  </div>;
  }
});

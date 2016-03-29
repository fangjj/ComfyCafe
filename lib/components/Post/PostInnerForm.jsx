import React from "react";

import {
  TextField,
  Checkbox,
  FlatButton
} from "material-ui";

PostInnerForm = React.createClass({
  renderSourceField() {
    if (this.props.originality !== "original") {
      return <TextField
        defaultValue={this.props.source}
        floatingLabelText="Source"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={1}
        rowsMax={3}
        onChange={this.props.handleSource}
        fullWidth={true}
      />;
    }
  },
  render() {
    return <div>
      <SelectVisibility
        visibility={this.props.visibility}
        onChange={this.props.handleVisibility}
      />
      <OriginalitySelector
        value={this.props.originality}
        onChange={this.props.handleOriginality}
      />
      {this.renderSourceField()}
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

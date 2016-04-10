import React from "react";

import VisibilitySelector from "../VisibilitySelector";

import {
  TextField
} from "material-ui";

export default React.createClass({
  render() {
    return <div>
      <TextField
        defaultValue={this.props.name}
        floatingLabelText="Name"
        floatingLabelStyle={{fontSize: "20px"}}
        fullWidth={true}
        onChange={this.props.handleName}
      />
      <VisibilitySelector
        visibility={this.props.visibility}
        onChange={this.props.handleVisibility}
      />
      <TextField
        defaultValue={this.props.description}
        floatingLabelText="Description"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={3}
        rowsMax={10}
        fullWidth={true}
        onChange={this.props.handleDescription}
      />
      <TextField
        defaultValue={this.props.rules}
        floatingLabelText="Rules"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={3}
        rowsMax={10}
        fullWidth={true}
        onChange={this.props.handleRules}
      />
    </div>;
  }
});

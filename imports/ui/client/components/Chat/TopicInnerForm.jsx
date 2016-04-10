import React from "react";

import VisibilitySelector from "/imports/ui/client/components/VisibilitySelector";

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
        onChange={this.props.handleName}
        fullWidth={true}
      />
      <VisibilitySelector
        visibility={this.props.visibility}
        onChange={this.props.handleVisibility}
      />
    </div>;
  }
});

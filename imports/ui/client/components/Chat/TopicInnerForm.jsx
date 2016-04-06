import React from "react";

import VisibilitySelector from "../VisibilitySelector";

import {
  TextField
} from "material-ui";

const TopicInnerForm = React.createClass({
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

export default TopicInnerForm;

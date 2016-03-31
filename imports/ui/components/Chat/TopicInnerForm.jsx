import React from "react";

import SelectVisibility from "../SelectVisibility";

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
      <br />
      <SelectVisibility
        visibility={this.props.visibility}
        onChange={this.props.handleVisibility}
      />
    </div>;
  }
});

export default TopicInnerForm;

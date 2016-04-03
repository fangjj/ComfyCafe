import React from "react";

import SelectVisibility from "../SelectVisibility";

import {
  TextField
} from "material-ui";

const BlogInnerForm = React.createClass({
  render() {
    return <div>
      <SelectVisibility
        visibility={this.props.visibility}
        onChange={this.props.handleVisibility}
      />
      <br />
      <TextField
        defaultValue={this.props.body}
        floatingLabelText="Body"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={4}
        rowsMax={10}
        onChange={this.props.handleBody}
        fullWidth={true}
      />
  </div>;
  }
});

export default BlogInnerForm;
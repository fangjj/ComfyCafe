import React from "react";

let {
  TextField
} = mui;

BlogInnerForm = React.createClass({
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

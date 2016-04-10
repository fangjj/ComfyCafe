import React from "react";

import generateMessageHint from "/imports/api/messages/nameGen/hintGenerator";

import {
  TextField
} from "material-ui";

export default (props) => {
  const value = {};
  if (props.directValue) {
    value.value = props.body;
  } else {
    value.defaultValue = props.body;
  }
  return <div className="messageInput">
    <TextField
      {...value}
      hintText={generateMessageHint()}
      multiLine={true}
      rows={3}
      rowsMax={10}
      onChange={props.handleBody}
      fullWidth={true}
    />
  </div>;
};

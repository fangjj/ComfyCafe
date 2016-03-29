import React from "react";

import {
  TextField
} from "material-ui";

const MessageInnerForm = React.createClass({
  render() {
    let value = {};
    if (this.props.directValue) {
      value.value = this.props.body;
    } else {
      value.defaultValue = this.props.body;
    }
    return <div className="messageInput">
      <TextField
        {...value}
        hintText={generateMessageHint()}
        multiLine={true}
        rows={3}
        rowsMax={10}
        onChange={this.props.handleBody}
        fullWidth={true}
      />
    </div>;
  }
});

export default MessageInnerForm;

import React from "react";

import {
  Dialog,
  FlatButton
} from "material-ui";

export default (props) => {
  const { onSubmit, onClose, formId, children, ...leftoverProps } = props;

  const actions = [
    <FlatButton
      label="Cancel"
      labelStyle={{ fontSize: "18px" }}
      primary={true}
      onTouchTap={onClose}
    />,
    <FlatButton
      type={formId ? "submit" : undefined}
      form={formId}
      label="Submit"
      labelStyle={{ fontSize: "18px" }}
      secondary={true}
      onTouchTap={formId ? undefined : onSubmit}
    />,
  ];

  return <Dialog
    actions={actions}
    modal={false}
    autoScrollBodyContent={true}
    onRequestClose={onClose}
    {...leftoverProps}
  >
    {children}
  </Dialog>;
};

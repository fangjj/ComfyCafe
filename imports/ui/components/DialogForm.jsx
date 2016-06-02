import React from "react";

import Dialog from "/imports/ui/components/Dialog";

export default (props) => {
  const form = React.cloneElement(props.form, {
    id: props.id,
    onClose: props.onClose
  });

  return <Dialog
    title={props.title}
    formId={props.id}
    open={true}
    onClose={props.onClose}
  >
    {form}
  </Dialog>;
};

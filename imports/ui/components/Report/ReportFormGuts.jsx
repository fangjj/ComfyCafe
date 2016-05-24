import React from "react";

import TextArea from "/imports/ui/components/TextArea";
import ViolationSelector from "/imports/ui/components/ViolationSelector";

export default (props) => {
  return <div>
    <ViolationSelector
      value={props.violation}
      onChange={props.handleViolation}
    />
    <TextArea
      defaultValue={props.details}
      label="Details"
      rows={3}
      rowsMax={5}
      onChange={props.handleDetails}
    />
  </div>;
};

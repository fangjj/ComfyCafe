import React from "react";

import TextArea from "/imports/ui/components/TextArea";
import ViolationSelector from "/imports/ui/components/ViolationSelector";

export default (props) => {
  return <div>
    <ViolationSelector
      id="reportViolation"
      itemType={props.itemType}
      value={props.violation}
      onChange={props.handleViolation}
    />
    <TextArea
      id="reportDetails"
      defaultValue={props.details}
      label="Details"
      rows={3}
      
      onChange={props.handleDetails}
    />
  </div>;
};

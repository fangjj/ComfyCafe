import React from "react";

import DangerButton from "/imports/ui/client/components/Button/DangerButton";

export default (props) => {
  return <DangerButton
    label="Report"
    iconName="flag"
    subtle={true}
    {...props}
  />;
};

import React from "react";

import DangerButton from "/imports/ui/components/Button/DangerButton";
import Icon from "/imports/ui/components/Daikon/Icon";

export default (props) => {
  if (! props.icon) {
    return <DangerButton
      label="Report"
      iconName="flag"
      subtle={true}
      {...props}
    />;
  } else {
    return <Icon className="reportIcon" title="Report" {...props}>flag</Icon>;
  }
};

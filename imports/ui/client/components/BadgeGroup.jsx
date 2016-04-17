import _ from "lodash";
import React from "react";

import Badge from "/imports/ui/client/components/Badge";

export default (props) => {
  const { badges, ...leftoverProps } = props;
  return <div className="badgeGroup" {...leftoverProps}>
    {_.map(badges, (badge) => {
      return <Badge badge={badge} key={badge._id} />;
    })}
  </div>;
};

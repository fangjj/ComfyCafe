import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
import Icon from "/imports/ui/client/components/Daikon/Icon";

export default (props) => {
  const { badge, ...leftoverProps } = props;
  const classes = classConcat("badge", badge.type);
  return <div className={classes} title={badge.type} {...leftoverProps}>
    <Icon>{badge.icon}</Icon> <span className="label">{badge.name}</span>
  </div>;
};

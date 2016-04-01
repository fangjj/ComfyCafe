import React from "react";

import classConcat from "/imports/api/common/classConcat";

import Icon from "./Icon";

import {
  FloatingActionButton
} from "material-ui";

const FAB = (props) => {
  const { className, iconName, children, ...leftProps } = props;
  const classes = classConcat("fixed-action-btn", className);
  return <div className={classes}>
    <FloatingActionButton primary={true} {...leftProps}>
      <Icon>{iconName}</Icon>
    </FloatingActionButton>
    {children}
  </div>;
};

export default FAB;

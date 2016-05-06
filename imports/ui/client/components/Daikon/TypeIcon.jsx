import _ from "lodash";
import React from "react";

import Icon from "/imports/ui/client/components/Daikon/Icon";

const iconMap = {
  user: "user",
  post: "image",
  blog: "weekend",
  tag: "style"
};

export default (props) => {
  const { value, ...leftoverProps } = props;
  return <Icon title={_.capitalize(value)} {...leftoverProps}>
    {_.get(iconMap, value, "error")}
  </Icon>;
};

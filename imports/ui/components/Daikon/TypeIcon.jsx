import _ from "lodash";
import React from "react";

import Icon from "/imports/ui/components/Daikon/Icon";

const iconMap = {
  user: "person",
  image: "image",
  message: "chat_bubble"
};

export default (props) => {
  const { value, ...leftoverProps } = props;
  return <Icon title={_.capitalize(value)} {...leftoverProps}>
    {_.get(iconMap, value, "error")}
  </Icon>;
};

import _ from "lodash";
import React from "react";

import Icon from "/imports/ui/client/components/Daikon/Icon";

const iconMap = {
  original: "star",
  derivative: "device_hub",
  repost: "repeat"
};

export default (props) => {
  const { originality, ...leftoverProps } = props;
  return <Icon title={_.capitalize(originality)} {...leftoverProps}>
    {iconMap[originality]}
  </Icon>;
};

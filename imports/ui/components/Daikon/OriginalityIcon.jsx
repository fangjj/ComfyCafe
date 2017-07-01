import _ from "lodash";
import React from "react";

import originalMap from "/imports/ui/utils/originalMap";
import Icon from "/imports/ui/components/Daikon/Icon";

const iconMap = {
  original: "star",
  repost: "repeat"
};

export default (props) => {
  const { value, ...leftoverProps } = props;
  const label = originalMap(value);
  return <Icon title={_.capitalize(label)} {...leftoverProps}>
    {iconMap[label]}
  </Icon>;
};

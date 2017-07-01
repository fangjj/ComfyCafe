import _ from "lodash";
import React from "react";

import dankMap from "/imports/ui/utils/dankMap";
import Icon from "/imports/ui/components/Daikon/Icon";

const iconMap = {
  legit: "work",
  dank: "local_pizza"
};

export default (props) => {
  const { value, ...leftoverProps } = props;
  const label = dankMap(value);
  return <Icon title={_.capitalize(label)} {...leftoverProps}>
    {iconMap[label]}
  </Icon>;
};

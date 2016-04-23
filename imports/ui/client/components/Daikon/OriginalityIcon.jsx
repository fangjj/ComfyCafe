import _ from "lodash";
import React from "react";

import Icon from "/imports/ui/client/components/Daikon/Icon";

const iconMap = {
  original: "star",
  derivative: "device_hub",
  repost: "repeat"
};

export default (props) => {
  return <Icon
    className="sigil"
    title={_.capitalize(props.originality)}
  >
    {iconMap[props.originality]}
  </Icon>;
};

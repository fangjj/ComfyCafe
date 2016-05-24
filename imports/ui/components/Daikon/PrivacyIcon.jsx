import _ from "lodash";
import React from "react";

import Icon from "/imports/ui/components/Daikon/Icon";

const iconMap = {
  public: "public",
  friends: "people",
  unlisted: "visibility_off"
};

export default (props) => {
  const { privacy, ...leftoverProps } = props;
  return <Icon title={_.capitalize(privacy)} {...leftoverProps}>
    {iconMap[privacy]}
  </Icon>;
};

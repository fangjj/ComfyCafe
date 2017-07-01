import _ from "lodash";
import React from "react";

import publishedMap from "/imports/ui/utils/publishedMap";
import Icon from "/imports/ui/components/Daikon/Icon";

const iconMap = {
  public: "public",
  unlisted: "visibility_off"
};

export default (props) => {
  const { published, ...leftoverProps } = props;
  const label = publishedMap(published);
  return <Icon title={_.capitalize(label)} {...leftoverProps}>
    {iconMap[label]}
  </Icon>;
};

import _ from "lodash";
import React from "react";

import Icon from "/imports/ui/client/components/Daikon/Icon";

const iconMap = {
  public: "public",
  friends: "people",
  unlisted: "visibility_off"
};

export default (props) => {
  return <Icon
    className="sigil"
    title={_.capitalize(props.privacy)}
  >
    {iconMap[props.privacy]}
  </Icon>;
};

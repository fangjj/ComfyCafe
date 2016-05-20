import React from "react";

import adminUrlBuilder from "/imports/ui/client/utils/adminUrlBuilder";
import Icon from "/imports/ui/client/components/Daikon/Icon";

export default (props) => {
  const { item } = props;
  item.type = item.type || props.itemType;
  const url = adminUrlBuilder(item);
  return <div className="modIcon">
    <a href={url} title="Moderate">
      <Icon>gavel</Icon>
    </a>
  </div>;
};

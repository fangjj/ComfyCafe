import React from "react";

import adminUrlBuilder from "/imports/ui/utils/adminUrlBuilder";
import Icon from "/imports/ui/components/Daikon/Icon";

export default (props) => {
  const { item } = props;
  item.type = item.type || props.itemType;
  const url = adminUrlBuilder(item, props.community);
  return <div className="modIcon">
    <a href={url} title="Moderate">
      <Icon>gavel</Icon>
    </a>
  </div>;
};

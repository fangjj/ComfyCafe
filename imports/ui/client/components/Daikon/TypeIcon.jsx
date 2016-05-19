import _ from "lodash";
import React from "react";

import Icon from "/imports/ui/client/components/Daikon/Icon";

const iconMap = {
  user: "person",
  image: "image",
  blog: "weekend",
  page: "import_contacts",
  album: "collections",
  community: "forum",
  topic: "speaker_notes",
  message: "chat_bubble",
  tag: "style",
  filter: "filter_list"
};

export default (props) => {
  const { value, ...leftoverProps } = props;
  return <Icon title={_.capitalize(value)} {...leftoverProps}>
    {_.get(iconMap, value, "error")}
  </Icon>;
};

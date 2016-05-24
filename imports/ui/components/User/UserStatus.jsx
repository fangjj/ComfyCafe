import _ from "lodash";
import React from "react";

import statusLabel from "/imports/ui/utils/statusLabel";

export default (props) => {
  const user = props.user;
  if (! user.status) {
    return null;
  }
  const status = statusLabel(user);
  return <div className={"status " + status} title={_.capitalize(status)}></div>
};

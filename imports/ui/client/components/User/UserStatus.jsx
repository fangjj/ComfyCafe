import _ from "lodash";
import React from "react";

export default (props) => {
  const user = props.user;
  let status = "online";
  if (! user.status.online) {
    status = "offline";
  }
  if (user.status.idle) {
    status = "idle";
  }
  return <div className={"status " + status} title={_.capitalize(status)}></div>
};

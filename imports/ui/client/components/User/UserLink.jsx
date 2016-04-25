import _ from "lodash";
import React from "react";

export default (props) => {
  const user = props.user;
  const path = FlowRouter.path("profile", {username: user.username});
  return <span className="userLink">
    <a href={path} title={user.profile.blurb}>
      {user.profile.displayName || user.username}
    </a>
  </span>;
};

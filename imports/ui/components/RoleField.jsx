import React from "react";

import Checkbox from "/imports/ui/components/Checkbox";

export default (props) => {
  return <div>
    <Checkbox
      label="Admin"
      checked={props.isAdmin}
      onCheck={props.handleAdmin}
    />
    { typeof props.isDev !== "undefined" ? <Checkbox
      label="Developer"
      checked={props.isDev}
      onCheck={props.handleDev}
    /> : null }
    <Checkbox
      label="Moderator"
      checked={props.isMod}
      onCheck={props.handleMod}
    />
    { typeof props.isMember !== "undefined" ? <Checkbox
      label="Member"
      checked={props.isMember}
      onCheck={props.handleMember}
    /> : null }
  </div>;
};

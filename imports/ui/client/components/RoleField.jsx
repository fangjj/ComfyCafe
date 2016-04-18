import React from "react";

import Checkbox from "/imports/ui/client/components/Checkbox";

export default (props) => {
  return <div>
    <Checkbox
      label="Admin"
      checked={props.isAdmin}
      onCheck={props.handleAdmin}
    />
    <Checkbox
      label="Developer"
      checked={props.isDev}
      onCheck={props.handleDev}
    />
    <Checkbox
      label="Moderator"
      checked={props.isMod}
      onCheck={props.handleMod}
    />
  </div>;
};

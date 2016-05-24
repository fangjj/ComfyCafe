import React from "react";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";

import Icon from "/imports/ui/components/Daikon/Icon";

export default (props) => {
  const moreBtn = <IconButton>
    <Icon>more_horiz</Icon>
  </IconButton>;

  return <div className="more">
    <IconMenu
      iconButtonElement={moreBtn}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
      targetOrigin={{ horizontal: "right", vertical: "top" }}
    >
      {props.children}
    </IconMenu>
    {props.form}
  </div>;
};

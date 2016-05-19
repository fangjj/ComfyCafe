import React from "react";
import IconButton from "material-ui/IconButton";

import adminUrlBuilder from "/imports/ui/client/utils/adminUrlBuilder";
import ModLogItem from "/imports/ui/client/components/ModLog/ModLogItem";
import Icon from "/imports/ui/client/components/Daikon/Icon";

export default (props) => {
  props.report.item.action = "reported";
  props.report.item.url = adminUrlBuilder(props.report.item);
  return <ModLogItem ml={props.report}>
    <div className="delete">
      <IconButton onTouchTap={() => Meteor.call("modDeleteReport", props.report._id)}>
        <Icon>close</Icon>
      </IconButton>
    </div>
  </ModLogItem>;
};

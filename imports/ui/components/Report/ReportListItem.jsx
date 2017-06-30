import React from "react";
import IconButton from "material-ui/IconButton";

import adminUrlBuilder from "/imports/ui/utils/adminUrlBuilder";
import ModLogItem from "/imports/ui/components/ModLog/ModLogItem";
import Icon from "/imports/ui/components/Daikon/Icon";

export default (props) => {
  props.report.item.action = "reported";
  props.report.item.url = expr(() => {
    if (! props.report.community) {
      return adminUrlBuilder(props.report.item);
    } else {
      return FlowRouter.path("communityAdminView", {
        roomSlug: props.report.community.slug,
        panel: props.report.item.type,
        id: props.report.item._id
      });
    }
  });
  return <ModLogItem ml={props.report}>
    <div className="delete">
      <IconButton onClick={() => Meteor.call("modDeleteReport", props.report._id)}>
        <Icon>close</Icon>
      </IconButton>
    </div>
  </ModLogItem>;
};

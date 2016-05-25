import _ from "lodash";
import React from "react";

import { isPriveleged } from "/imports/api/common/persimmons";
import ChatReportPanel from "./ChatReportPanel";
import ChatMemberPanelContainer from "./ChatMemberPanelContainer";
import ChatTopicPanelContainer from "./ChatTopicPanelContainer";
import ChatMessagePanelContainer from "./ChatMessagePanelContainer";
import ChatMemberViewContainer from "./ChatMemberViewContainer";
//import ChatTopicViewContainer from "./ChatTopicViewContainer";
//import ChatMessageViewContainer from "./ChatMessageViewContainer";
import Err403 from "/imports/ui/components/Err403";
import Content from "/imports/ui/components/Content";
import List from "/imports/ui/components/List";
import DenseLayout from "/imports/ui/components/DenseLayout";
import DenseCol from "/imports/ui/components/DenseCol";
import DenseContent from "/imports/ui/components/DenseContent";

function panelUrl(panel) {
  if (panel === "reports") {
    return FlowRouter.path("communityAdmin", { roomSlug: FlowRouter.getParam("roomSlug") });
  }
  return FlowRouter.path("communityAdminPanel", {
    roomSlug: FlowRouter.getParam("roomSlug"),
    panel
  });
}

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  renderInner() {
    const group = "community_" + FlowRouter.getParam("roomSlug");
    if (this.context.currentUser && isPriveleged(this.context.currentUser._id, group)) {
      const panel = FlowRouter.getParam("panel");
      const entityId = FlowRouter.getParam("id");
      if (entityId) {
        return _.get(
          {
            members: <ChatMemberViewContainer />,
          //topics: <ChatTopicViewContainer />,
          //messages: <ChatMessageViewContainer />
          },
          panel,
          <DenseContent>
            Missing panel
          </DenseContent>
        );
      } else {
        return _.get(
          {
            members: <ChatMemberPanelContainer />,
            topics: <ChatTopicPanelContainer />,
            messages: <ChatMessagePanelContainer />
          },
          panel,
          <ChatReportPanel />
        );
      }
    } else {
      return <Err403 />;
    }
  },
  render() {
    return <DenseLayout>
      <div className="col leftCol">
        <List>
          <li><a href={panelUrl("reports")}>Reports</a></li>
          <li><a href={panelUrl("members")}>Members</a></li>
          <li><a href={panelUrl("topics")}>Topics</a></li>
          <li><a href={panelUrl("messages")}>Messages</a></li>
        </List>
      </div>

      <div className="col mainCol">
        {this.renderInner()}
      </div>
    </DenseLayout>;
  }
});

import _ from "lodash";
import React from "react";

import "/imports/api/migrations/methods";
import { isPriveleged } from "/imports/api/common/persimmons";
import ChatReportPanel from "./ChatReportPanel";
//import ChatUserPanelContainer from "./ChatUserPanelContainer";
//import ChatTopicPanelContainer from "./ChatTopicPanelContainer";
//import ChatMessagePanelContainer from "./ChatMessagePanelContainer";
import ChatBadgePanelContainer from "./ChatBadgePanelContainer";
//import ChatTopicPanelContainer from "./ChatTopicPanelContainer";
//import ChatUserViewContainer from "./ChatUserViewContainer";
//import ChatTopicViewContainer from "./ChatTopicViewContainer";
//import ChatMessageViewContainer from "./ChatMessageViewContainer";
//import ChatBadgeViewContainer from "./ChatBadgeViewContainer";
import Err403 from "/imports/ui/components/Err403";
import Content from "/imports/ui/components/Content";
import List from "/imports/ui/components/List";
import DenseLayout from "/imports/ui/components/DenseLayout";
import DenseCol from "/imports/ui/components/DenseCol";
import DenseContent from "/imports/ui/components/DenseContent";

/*
Report Passthrough
spam: "Spam" -> Comm
copyright: "Copyright" -> Global
harassment: "Harassment" -> Global
fraud: "Fraudulent" -> Global
mistagged: "Intentionally Mistagged" -> N/A
unsafe: "Wrong Safety" -> N/A
offtopic: "Off-Topic/Indecorum/Nongermane" -> Comm
broken: "Broken" -> Global
illegal: "Illegal" -> Global
other: "Other" -> Comm

Communities can choose to forward to Global
*/

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
            //members: <ChatUserViewContainer />,
          //topics: <ChatTopicViewContainer />,
          //messages: <ChatMessageViewContainer />,
            //badges: <ChatBadgeViewContainer />
          },
          panel,
          <DenseContent>
            Missing panel
          </DenseContent>
        );
      } else {
        return _.get(
          {
            //members: <ChatUserPanelContainer />
          //topics: <ChatTopicPanelContainer />,
          //messages: <ChatMessagePanelContainer />,
            badges: <ChatBadgePanelContainer />
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
          <li><a href="/ca">Reports</a></li>
          <li><a href="/ca/members">Members</a></li>
          <li><a href="/ca/topics">Topics</a></li>
          <li><a href="/ca/messages">Messages</a></li>
          <li><a href="/ca/badges">Badges</a></li>
        </List>
      </div>

      <div className="col mainCol">
        {this.renderInner()}
      </div>
    </DenseLayout>;
  }
});

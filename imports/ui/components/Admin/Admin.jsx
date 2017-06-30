import _ from "lodash";
import React from "react";

import "/imports/api/migrations/methods";
import { isPriveleged } from "/imports/api/common/persimmons";
import ReportPanel from "./ReportPanel";
import UserPanelContainer from "./UserPanelContainer";
import ImagePanelContainer from "./ImagePanelContainer";
import MessagePanelContainer from "./MessagePanelContainer";
import MediaPanel from "./MediaPanel";
import NotificationPanel from "./NotificationPanel";
import UserViewContainer from "./UserViewContainer";
import ImageViewContainer from "./ImageViewContainer";
import MessageViewContainer from "./MessageViewContainer";
import Err403 from "/imports/ui/components/Err403";
import Content from "/imports/ui/components/Content";
import List from "/imports/ui/components/List";
import DenseLayout from "/imports/ui/components/DenseLayout";
import DenseCol from "/imports/ui/components/DenseCol";
import DenseContent from "/imports/ui/components/DenseContent";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  renderInner() {
    if (this.context.currentUser && isPriveleged(this.context.currentUser._id)) {
      const panel = FlowRouter.getParam("panel");
      const entityId = FlowRouter.getParam("id");
      if (entityId) {
        return _.get(
          {
            users: <UserViewContainer />,
            images: <ImageViewContainer />,
            messages: <MessageViewContainer />
          },
          panel,
          <DenseContent>
            Missing panel
          </DenseContent>
        );
      } else {
        return _.get(
          {
            users: <UserPanelContainer />,
            images: <ImagePanelContainer />,
            messages: <MessagePanelContainer />,
            media: <MediaPanel />,
            notifications: <NotificationPanel />
          },
          panel,
          <ReportPanel />
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
          <li><a href="/admin">Reports</a></li>
          <li><a href="/admin/users">Users</a></li>
          <li><a href="/admin/images">Images</a></li>
          <li><a href="/admin/messages">Messages</a></li>
          <li><a href="/admin/notifications">Notifications</a></li>
          <li><a href="/admin/media">Media</a></li>
        </List>
      </div>

      <div className="col mainCol">
        {this.renderInner()}
      </div>
    </DenseLayout>;
  }
});

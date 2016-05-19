import _ from "lodash";
import React from "react";

import "/imports/api/migrations/methods";
import { isPriveleged } from "/imports/api/common/persimmons";
import ReportPanel from "./ReportPanel";
import UserPanelContainer from "./UserPanelContainer";
import ImagePanelContainer from "./ImagePanelContainer";
import BlogPanelContainer from "./BlogPanelContainer";
import PagePanelContainer from "./PagePanelContainer";
import AlbumPanelContainer from "./AlbumPanelContainer";
import CommunityPanelContainer from "./CommunityPanelContainer";
import TopicPanelContainer from "./TopicPanelContainer";
import MessagePanelContainer from "./MessagePanelContainer";
import BadgePanel from "./BadgePanel";
import MediaPanel from "./MediaPanel";
import FilterPanelContainer from "./FilterPanelContainer";
import NotificationPanel from "./NotificationPanel";
import TopicPanel from "./TopicPanel";
import UserViewContainer from "./UserViewContainer";
import ImageViewContainer from "./ImageViewContainer";
import BlogViewContainer from "./BlogViewContainer";
import PageViewContainer from "./PageViewContainer";
import AlbumViewContainer from "./AlbumViewContainer";
import CommunityViewContainer from "./CommunityViewContainer";
import TopicViewContainer from "./TopicViewContainer";
import MessageViewContainer from "./MessageViewContainer";
import BadgeViewContainer from "./BadgeViewContainer";
import FilterViewContainer from "./FilterViewContainer";
import Err403 from "/imports/ui/client/components/Err403";
import Content from "/imports/ui/client/components/Content";
import List from "/imports/ui/client/components/List";
import DenseLayout from "/imports/ui/client/components/DenseLayout";
import DenseCol from "/imports/ui/client/components/DenseCol";
import DenseContent from "/imports/ui/client/components/DenseContent";

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
            blog: <BlogViewContainer />,
            pages: <PageViewContainer />,
            albums: <AlbumViewContainer />,
            communities: <CommunityViewContainer />,
            topics: <TopicViewContainer />,
            messages: <MessageViewContainer />,
            filters: <FilterViewContainer />,
            badges: <BadgeViewContainer />
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
            blog: <BlogPanelContainer />,
            pages: <PagePanelContainer />,
            albums: <AlbumPanelContainer />,
            communities: <CommunityPanelContainer />,
            topics: <TopicPanelContainer />,
            messages: <MessagePanelContainer />,
            badges: <BadgePanel />,
            media: <MediaPanel />,
            tags: <DenseContent>nope</DenseContent>,
            filters: <FilterPanelContainer />,
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
          <li><a href="/admin/blog">Blog</a></li>
          <li><a href="/admin/pages">Pages</a></li>
          <li><a href="/admin/albums">Albums</a></li>
          <li><a href="/admin/communities">Communities</a></li>
          <li><a href="/admin/topics">Topics</a></li>
          <li><a href="/admin/messages">Messages</a></li>
          <li><a href="/admin/tags">Tags</a></li>
          <li><a href="/admin/filters">Filters</a></li>
          <li><a href="/admin/notifications">Notifications</a></li>
          <li><a href="/admin/badges">Badges</a></li>
          <li><a href="/admin/media">Media</a></li>
        </List>
      </div>

      <div className="col mainCol">
        {this.renderInner()}
      </div>
    </DenseLayout>;
  }
});

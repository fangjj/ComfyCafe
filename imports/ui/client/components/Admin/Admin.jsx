import _ from "lodash";
import React from "react";

import "/imports/api/migrations/methods";
import UserPanel from "./UserPanel";
import ImagePanel from "./ImagePanel";
import BadgePanel from "./BadgePanel";
import UserViewContainer from "./UserViewContainer";
import BadgeViewContainer from "./BadgeViewContainer";
import Content from "/imports/ui/client/components/Content";
import List from "/imports/ui/client/components/List";
import DenseLayout from "/imports/ui/client/components/DenseLayout";
import DenseCol from "/imports/ui/client/components/DenseCol";
import DenseContent from "/imports/ui/client/components/DenseContent";

export default React.createClass({
  doIt() {
    Meteor.call("migrateColor");
  },
  renderInner() {
    const isAdmin = Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP);
    if (isAdmin) {
      const panel = FlowRouter.getParam("panel");
      const entityId = FlowRouter.getParam("id");
      if (entityId) {
        return _.get(
          {
            users: <UserViewContainer />,
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
            users: <UserPanel />,
            images: <ImagePanel />,
            blog: <DenseContent>
              <a onTouchTap={() => { Meteor.call("migrateBlog") }}>Migrate</a>
            </DenseContent>,
            badges: <BadgePanel />
          },
          panel,
          <DenseContent>
            Admin panel
          </DenseContent>
        );
      }
    } else {
      return <DenseContent>
        You don't have persimmons to view this!
      </DenseContent>;
    }
  },
  render() {
    return <DenseLayout>
      <DenseCol className="leftCol">
        <List>
          <li><a href="/admin">Admin</a></li>
          <li><a href="/admin/users">Users</a></li>
          <li><a href="/admin/images">Images</a></li>
          <li><a href="/admin/blog">Blog</a></li>
          <li><a href="/admin/tags">Tags</a></li>
          <li><a href="/admin/badges">Badges</a></li>
          <li><a href="/admin/invites">Invites</a></li>
        </List>
      </DenseCol>

      <DenseCol className="mainCol">
        {this.renderInner()}
      </DenseCol>
    </DenseLayout>;
  }
});

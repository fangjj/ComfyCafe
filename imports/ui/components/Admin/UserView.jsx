import React from "react";

import "/imports/api/users/adminMethods";
import { isAdmin } from "/imports/api/common/persimmons";
import DenseContent from "/imports/ui/components/DenseContent";
import UserAdminForm from "/imports/ui/components/Admin/UserAdminForm";
import UserProfileForm from "/imports/ui/components/User/UserProfileForm";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  renderAdminForm(user) {
    if (isAdmin(this.context.currentUser._id)) {
      return <UserAdminForm user={user} />;
    }
  },
  render() {
    const { user } = this.props;
    return <DenseContent>
      <header>
        <h2>
          <a href={FlowRouter.path("profile", { username: user.username })}>
            {_.get(user, "profile.displayName", user.username) + " (" + user.username + ")"}
          </a>
        </h2>
      </header>

      {this.renderAdminForm(user)}
      <UserProfileForm user={user} mod={true} actions={true} />
    </DenseContent>;
  }
});

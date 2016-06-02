import _ from "lodash";
import React from "react";

import "/imports/api/users/adminMethods";
import { isAdmin } from "/imports/api/common/persimmons";
import DenseContent from "/imports/ui/components/DenseContent";
import UserAdminForm from "/imports/ui/components/Admin/UserAdminForm";
import UserBanForm from "/imports/ui/components/Admin/UserBanForm";
import UserProfileForm from "/imports/ui/components/User/UserProfileForm";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  renderAdminForm(user) {
    if (isAdmin(this.context.currentUser._id)) {
      return <section>
        <header>
          <h3>Roles</h3>
        </header>
        <UserAdminForm user={user} />
      </section>;
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
      <section>
        <header>
          <h3>Ban</h3>
        </header>
        <UserBanForm user={user} />
      </section>
      <section>
        <header>
          <h3>Modify</h3>
        </header>
        <UserProfileForm user={user} mod={true} actions={true} />
      </section>
    </DenseContent>;
  }
});

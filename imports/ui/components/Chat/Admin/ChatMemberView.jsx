import _ from "lodash";
import React from "react";

import "/imports/api/rooms/methods";
import { isAdmin } from "/imports/api/common/persimmons";
import DenseContent from "/imports/ui/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import ChatRoleForm from "/imports/ui/components/Chat/Admin/ChatRoleForm";
import UserBanForm from "/imports/ui/components/Admin/UserBanForm";
import DangerButton from "/imports/ui/components/Button/DangerButton";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  kick() {
    const slug = FlowRouter.getParam("roomSlug");
    Meteor.call("kickUser", slug, this.props.user._id);
  },
  renderInner(user) {
    const slug = FlowRouter.getParam("roomSlug");
    if (isAdmin(this.context.currentUser._id, "community_" + slug)) {
      return <ChatRoleForm user={user} />;
    } else {
      return <DangerButton
        label="Kick"
        subtle={true}
        onClick={this.kick}
      />;
    }
  },
  render() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    const { user } = this.props;
    return <DenseContent>
      <header>
        <h2>
          <a href={FlowRouter.path("profile", { username: user.username })}>
            {_.get(user, "profile.displayName", user.username) + " (" + user.username + ")"}
          </a>
        </h2>
      </header>
      {this.renderInner(user)}
      <section>
        <header>
          <h3>Ban</h3>
        </header>
        <UserBanForm user={user} communitySlug={FlowRouter.getParam("roomSlug")} />
      </section>
    </DenseContent>;
  }
});

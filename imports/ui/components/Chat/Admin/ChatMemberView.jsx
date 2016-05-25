import _ from "lodash";
import React from "react";

import DenseContent from "/imports/ui/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import ChatRoleForm from "/imports/ui/components/Chat/Admin/ChatRoleForm";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
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
      <ChatRoleForm user={user} />
    </DenseContent>;
  }
});

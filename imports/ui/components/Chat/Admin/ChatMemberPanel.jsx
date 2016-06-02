import _ from "lodash";
import React from "react";

import DenseContent from "/imports/ui/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import List from "/imports/ui/components/List";

export default React.createClass({
  renderList() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    return _.map(this.props.users, (user) => {
      const path = FlowRouter.path("communityAdminView", {
        roomSlug: FlowRouter.getParam("roomSlug"),
        panel: "members",
        id: user._id
      });
      return <li key={user._id}>
        <a href={path}>{user.username}</a>
      </li>;
    });
  },
  render() {
    return <DenseContent>
      <List>
        {this.renderList()}
      </List>
    </DenseContent>;
  }
});

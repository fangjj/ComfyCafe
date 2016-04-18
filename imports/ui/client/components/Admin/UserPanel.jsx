import React from "react";

import DenseContent from "/imports/ui/client/components/DenseContent";
import List from "/imports/ui/client/components/List";

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const handle = Meteor.subscribe("adminAllUsers", Meteor.userId());
    return {
      loading: ! handle.ready(),
      users: Meteor.users.find(
        {},
        { sort: { username: 1 } }
      ).fetch()
    };
  },
  renderList() {
    return _.map(this.data.users, (user) => {
      const path = FlowRouter.path("adminView", {
        panel: "users",
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

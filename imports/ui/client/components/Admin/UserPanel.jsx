import React from "react";

import "/imports/api/migrations/methods";
import "/imports/api/users/adminMethods";
import DenseContent from "/imports/ui/client/components/DenseContent";
import List from "/imports/ui/client/components/List";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

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
  handleMigrate() {
    Meteor.call("migrateUserFilters");
  },
  handleRegen() {
    Meteor.call("adminDjentRegen");
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
      <SubmitButton
        label="Apply Migration"
        iconName="cached"
        onTouchTap={this.handleMigrate}
      />
      <SubmitButton
        label="Regenerate Djenticons"
        iconName="broken_image"
        onTouchTap={this.handleRegen}
      />
      <List>
        {this.renderList()}
      </List>
    </DenseContent>;
  }
});

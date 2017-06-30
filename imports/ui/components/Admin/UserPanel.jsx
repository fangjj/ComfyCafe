import _ from "lodash";
import React from "react";

import "/imports/api/migrations/methods";
import "/imports/api/users/adminMethods";
import DenseContent from "/imports/ui/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import List from "/imports/ui/components/List";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";

export default React.createClass({
  handleMigrate() {
    Meteor.call("migrateUserFilters");
  },
  handleRegen() {
    Meteor.call("adminDjentRegen");
  },
  renderList() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    return _.map(this.props.users, (user) => {
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
        onClick={this.handleMigrate}
      />
      <SubmitButton
        label="Regenerate Djenticons"
        iconName="broken_image"
        onClick={this.handleRegen}
      />
      <List>
        {this.renderList()}
      </List>
    </DenseContent>;
  }
});

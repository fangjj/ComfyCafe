import _ from "lodash";
import React from "react";

import "/imports/api/migrations/methods";
import DenseContent from "/imports/ui/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import List from "/imports/ui/components/List";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";

export default React.createClass({
  handleMigrate() {
    Meteor.call("migrateCommentPerms");
  },
  renderList() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    return _.map(this.props.communities, (community) => {
      const url = FlowRouter.path("adminView", {
        panel: "communities",
        id: community._id
      });
      return <li key={community._id}>
        <a href={url}>{community.name} {community.system ? "[SYSTEM]" : null}</a>
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
      <List>
        {this.renderList()}
      </List>
    </DenseContent>;
  }
});

import _ from "lodash";
import React from "react";

import "/imports/api/migrations/methods";
import Content from "/imports/ui/client/components/Content";
import List from "/imports/ui/client/components/List";
import DenseLayout from "/imports/ui/client/components/DenseLayout";
import DenseCol from "/imports/ui/client/components/DenseCol";

export default React.createClass({
  doIt() {
    Meteor.call("migrateColor");
  },
  renderInner() {
    const isAdmin = Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP);
    if (isAdmin) {
      return "ADMIN";
    } else {
      return "POSER";
    }
  },
  render() {
    return <DenseLayout>
      <DenseCol className="leftCol">
        <List>
          <li>gay</li>
          <li>gay</li>
          <li>gay</li>
        </List>
      </DenseCol>

      <DenseCol className="mainCol">
        {this.renderInner()}
      </DenseCol>
    </DenseLayout>;
  }
});

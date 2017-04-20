import React from "react";

import "/imports/api/migrations/methods";
import DenseContent from "/imports/ui/components/DenseContent";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";

export default React.createClass({
  handleMigrate() {
    Meteor.call("migrateNotifications");
  },
  render() {
    return <DenseContent>
      <SubmitButton
        label="Apply Migration"
        iconName="cached"
        onClick={this.handleMigrate}
      />
    </DenseContent>;
  }
});

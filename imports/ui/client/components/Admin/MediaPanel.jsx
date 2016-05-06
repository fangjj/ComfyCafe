import React from "react";

import "/imports/api/migrations/methods";
import DenseContent from "/imports/ui/client/components/DenseContent";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

export default React.createClass({
  handleMigrate() {
    Meteor.call("migrateMedia");
  },
  render() {
    return <DenseContent>
      <SubmitButton
        label="Apply Migration"
        iconName="cached"
        onTouchTap={this.handleMigrate}
      />
    </DenseContent>;
  }
});

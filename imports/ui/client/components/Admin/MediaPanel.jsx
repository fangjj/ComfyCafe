import React from "react";

import "/imports/api/migrations/methods";
import DenseContent from "/imports/ui/client/components/DenseContent";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

export default React.createClass({
  handleColors() {
    Meteor.call("migrateColor");
  },
  handleMigrate() {
    Meteor.call("migrateMedia");
  },
  render() {
    return <DenseContent>
      <SubmitButton
        label="Update Colors"
        iconName="colorize"
        onTouchTap={this.handleColors}
      />
      <SubmitButton
        label="Apply Migration"
        iconName="cached"
        onTouchTap={this.handleMigrate}
      />
    </DenseContent>;
  }
});

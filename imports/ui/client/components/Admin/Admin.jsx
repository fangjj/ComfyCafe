import _ from "lodash";
import React from "react";

import "/imports/api/migrations/methods";
import Content from "/imports/ui/client/components/Content";

export default React.createClass({
  doIt() {
    Meteor.call("migrateColor");
  },
  render() {
    return <Content>
      <div className="btn" onTouchTap={this.doIt}>
        Do something
      </div>
    </Content>;
  }
});

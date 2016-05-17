import React from "react";
import IconButton from "material-ui/IconButton";

import { isBirthday, shouldCelebrate, stopCelebrating } from "/imports/api/users/birthday";
import Icon from "/imports/ui/client/components/Daikon/Icon";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  dismiss() {
    stopCelebrating();
  },
  render() {
    if (isBirthday(this.context.currentUser) && shouldCelebrate(this.context.currentUser)) {
      return <li>
        <div className="row">
          <div className="inner">
            <Icon className="sigil">cake</Icon>
            <span className="label">
              Happy birthday!
            </span>
          </div>
          <IconButton className="dismiss" onTouchTap={this.dismiss}>
            <Icon>close</Icon>
          </IconButton>
        </div>
      </li>;
    }
    return null;
  },
});

import React from "react";

import { isBirthday, shouldCelebrate } from "/imports/api/users/birthday";
import Ripple from "/imports/ui/components/Ripple";
import Icon from "/imports/ui/components/Daikon/Icon";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  renderCount() {
    let count = this.props.notifications.length;
    if (isBirthday(this.context.currentUser) && shouldCelebrate(this.context.currentUser)) {
      count += 1;
    }
    if (count) {
      return <span className="push teal">{count}</span>;
    }
  },
  toggleListVisibility(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.action();
  },
  render() {
    return <a id="notificationListToggle"
      className="ignore-react-onclickoutside"
      onClick={this.toggleListVisibility}
    >
      <Ripple>
        <Icon>notifications</Icon>
        {this.renderCount()}
      </Ripple>
    </a>;
  }
});

import React from "react";

import Ripple from "/imports/ui/client/components/Ripple";
import Icon from "/imports/ui/client/components/Daikon/Icon";

export default React.createClass({
  renderCount() {
    if (this.props.notifications.length) {
      return <span className="push teal">{this.props.notifications.length}</span>;
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

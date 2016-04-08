import React from "react";

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
      className="ignore-react-onclickoutside waves-effect waves-teal"
      onClick={this.toggleListVisibility}
    >
      <Icon>notifications</Icon>
      {this.renderCount()}
    </a>;
  }
});

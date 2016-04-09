import React from "react";
import NativeListener from "react-native-listener";

import DirectAvatar from "/imports/ui/client/components/Avatar/DirectAvatar";

export default React.createClass({
  toggleActionsVisbility(event) {
    if (event.which === 2) {
      // Middle mouse click
    } else {
      event.preventDefault();
      event.stopPropagation();
      this.props.action();
    }
  },
  render() {
    return <NativeListener onClick={this.toggleActionsVisbility}>
      <a id="accountActionsToggle"
        className="ignore-react-onclickoutside"
        href={FlowRouter.path("profile", {username: this.props.currentUser.username})}
      >
        <DirectAvatar size="topBar" user={this.props.currentUser} />
      </a>
    </NativeListener>;
  }
});

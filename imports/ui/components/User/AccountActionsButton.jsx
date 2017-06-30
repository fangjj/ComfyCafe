import React from "react";
import NativeListener from "react-native-listener";

import Ripple from "/imports/ui/components/Ripple";
import DirectAvatar from "/imports/ui/components/Avatar/DirectAvatar";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
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
        href={FlowRouter.path("profile", {username: this.context.currentUser.username})}
      >
        <Ripple>
          <DirectAvatar size="topBar" user={this.context.currentUser} />
        </Ripple>
      </a>
    </NativeListener>;
  }
});

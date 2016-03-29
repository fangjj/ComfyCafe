import React from "react";
import NativeListener from "react-native-listener";

AccountActionsButton = React.createClass({
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
        className="ignore-react-onclickoutside waves-effect waves-teal"
        href={FlowRouter.path("profile", {username: this.props.currentUser.username})}
      >
        <DirectAvatar size="topBar" user={this.props.currentUser} />
      </a>
    </NativeListener>;
  }
});

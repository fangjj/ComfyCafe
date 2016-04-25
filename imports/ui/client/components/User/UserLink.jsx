import _ from "lodash";
import React from "react";

import UserPopover from "/imports/ui/client/components/User/UserPopover";

export default React.createClass({
  getInitialState() {
    return { open: false }
  },
  showPopover(e) {
    const $link = $(this.refs.link);
    const anchor = $link.offset().left;
    this.setState({
      open: true,
      anchor: anchor,
    });
  },
  hidePopover() {
    this.setState({ open: false });
  },
  renderPopover() {
    return <UserPopover
      user={this.props.user}
      anchor={this.state.anchor}
      open={this.state.open}
      onClose={this.hidePopover}
    />;
  },
  render() {
    const user = this.props.user;
    const path = FlowRouter.path("profile", {username: user.username});
    return <span className="userLink">
      <a ref="link" href={path} onMouseEnter={this.showPopover}>
        {user.profile.displayName || user.username}
      </a>
      {this.renderPopover()}
    </span>;
  }
});

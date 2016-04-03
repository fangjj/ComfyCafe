import React from "react";

import {
  Popover
} from "material-ui";

const UserPopover = React.createClass({
  render() {
    return <Popover
      open={this.props.open}
      anchorEl={this.props.anchorEl}
      anchorOrigin={{horizontal: "left", vertical: "bottom"}}
      targetOrigin={{horizontal: "left", vertical: "top"}}
      useLayerForClickAway={false}
      onRequestClose={this.props.onRequestClose}
    >
      <div style={{padding: 16}}>
        {this.props.user.profile.blurb}
      </div>
    </Popover>;
  }
});

export default UserPopover;

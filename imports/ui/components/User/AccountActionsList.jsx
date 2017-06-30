import _ from "lodash";
import React from "react";
import OnClickOutside from "react-onclickoutside";
import Menu from "material-ui/Menu";
import Divider from "material-ui/Divider";

import { isPriveleged } from "/imports/api/common/persimmons";
import TopMenuItem from "/imports/ui/components/TopBar/TopMenuItem";

export default React.createClass({
  mixins: [OnClickOutside],
  contextTypes: { currentUser: React.PropTypes.object },
  handleClickOutside(event) {
    if (this.props.visible) {
      this.props.action();
    }
  },
  logOut() {
    Meteor.logout();
  },
  renderAdminItem() {
    if (isPriveleged(this.context.currentUser._id)) {
      const adminUrl = FlowRouter.path("admin");
      return <TopMenuItem
        primaryText="Admin Panel"
        leftIconName="free_breakfast"
        href={adminUrl}
      />
    }
  },
  render() {
    let classes = "topMenu";
    if (this.props.visible) {
      classes = "topMenu active";
    }

    const username = this.context.currentUser.username;
    const profileUrl = FlowRouter.path("profile", { username });
    const likesUrl = FlowRouter.path("likes");
    const dmUrl = FlowRouter.path("dmList");
    const usersUrl = FlowRouter.path("users");
    const settingsUrl = FlowRouter.path("settings");

    return <div>
      <div id="accountActionsArrow" className={classes}></div>
      <Menu id="accountActions" className={classes} autoWidth={false}>
        <TopMenuItem
          primaryText="Profile"
          leftIconName="account_circle"
          href={profileUrl}
        />
        <TopMenuItem
          primaryText="Likes"
          leftIconName="favorite"
          href={likesUrl}
        />
        <TopMenuItem
          primaryText="Direct Messages"
          leftIconName="chat_bubble"
          href={dmUrl}
        />
        <TopMenuItem
          primaryText="Users"
          leftIconName="looks"
          href={usersUrl}
        />
        <TopMenuItem
          primaryText="Settings"
          leftIconName="settings"
          href={settingsUrl}
        />
        {this.renderAdminItem()}
        <TopMenuItem
          primaryText="Sign Out"
          leftIconName="directions_run"
          onClick={this.logOut}
        />
      </Menu>
    </div>;
  }
});

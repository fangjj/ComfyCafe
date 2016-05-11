import React from "react";
import OnClickOutside from "react-onclickoutside";
import Menu from "material-ui/Menu";
import Divider from "material-ui/Divider";

import { isPriveleged } from "/imports/api/common/persimmons";
import TopMenuItem from "/imports/ui/client/components/TopBar/TopMenuItem";

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
    const filtersUrl = FlowRouter.path("filtersBy", { username });
    const likesUrl = FlowRouter.path("likes");
    const yourAlbumsUrl = FlowRouter.path("albumsBy", { username });
    const yourPagesUrl = FlowRouter.path("pagesBy", { username });
    const invitesUrl = FlowRouter.path("invites");
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
          primaryText="Filters"
          leftIconName="filter_list"
          href={filtersUrl}
        />
        <TopMenuItem
          primaryText="Likes"
          leftIconName="favorite"
          href={likesUrl}
        />
        <TopMenuItem
          primaryText="Albums"
          leftIconName="collections"
          href={yourAlbumsUrl}
        />
        <TopMenuItem
          primaryText="Pages"
          leftIconName="import_contacts"
          href={yourPagesUrl}
        />
        <TopMenuItem
          primaryText="Beta Invites"
          leftIconName="vpn_key"
          href={invitesUrl}
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
          onTouchTap={this.logOut}
        />
      </Menu>
    </div>;
  }
});

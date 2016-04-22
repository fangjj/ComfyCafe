import React from "react";
import OnClickOutside from "react-onclickoutside";
import Menu from "material-ui/Menu";
import Divider from "material-ui/Divider";

import { isPriveleged } from "/imports/api/common/persimmons";
import TopMenuItem from "/imports/ui/client/components/TopBar/TopMenuItem";

export default React.createClass({
  mixins: [OnClickOutside],
  handleClickOutside(event) {
    if (this.props.visible) {
      this.props.action();
    }
  },
  logOut() {
    Meteor.logout();
  },
  renderAdminItem() {
    if (isPriveleged(this.props.currentUser._id)) {
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

    const profileUrl = FlowRouter.path("profile", {username: this.props.currentUser.username});
    const bookmarksUrl = FlowRouter.path("bookmarks");
    const likesUrl = FlowRouter.path("likes");
    const friendsUrl = FlowRouter.path("friends");
    const yourAlbumsUrl = FlowRouter.path("albumsBy", {username: this.props.currentUser.username});
    const yourPagesUrl = FlowRouter.path("pagesBy", {username: this.props.currentUser.username});
    const favoritesUrl = FlowRouter.path("favorites");
    const invitesUrl = FlowRouter.path("invites");
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
          primaryText="Bookmarks"
          leftIconName="bookmark"
          href={bookmarksUrl}
        />
        <TopMenuItem
          primaryText="Likes"
          leftIconName="favorite"
          href={likesUrl}
        />
        <TopMenuItem
          primaryText="Friends"
          leftIconName="looks"
          href={friendsUrl}
        />
        <TopMenuItem
          primaryText="Albums"
          leftIconName="album"
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

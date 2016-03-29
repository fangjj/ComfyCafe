import React from "react";
import OnClickOutside from "react-onclickoutside";

import {
  Menu,
  Divider
} from "material-ui";

const AccountActionsList = React.createClass({
  mixins: [OnClickOutside],
  handleClickOutside(event) {
    if (this.props.visible) {
      this.props.action();
    }
  },
  logOut() {
    Meteor.logout();
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
          primaryText="Pages"
          leftIconName="import_contacts"
          href={yourPagesUrl}
        />
        <TopMenuItem
          primaryText="Beta Invites"
          leftIconName="free_breakfast"
          href={invitesUrl}
        />
        <TopMenuItem
          primaryText="Settings"
          leftIconName="settings"
          href={settingsUrl}
        />
        <TopMenuItem
          primaryText="Sign Out"
          leftIconName="directions_run"
          onTouchTap={this.logOut}
        />
      </Menu>
    </div>;
  }
});

export default AccountActionsList;

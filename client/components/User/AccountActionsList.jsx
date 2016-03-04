let {
  Menu,
  Divider
} = mui;

AccountActionsList = React.createClass({
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
    var classes = "topMenu";
    if (this.props.visible) {
      classes = "topMenu active";
    }

    var profileUrl = FlowRouter.path("profile", {username: this.props.currentUser.username});
    var likesUrl = FlowRouter.path("likes");
    var yourArtUrl = FlowRouter.path("artBy", {username: this.props.currentUser.username});
    var yourBlogUrl = FlowRouter.path("blogBy", {username: this.props.currentUser.username});
    var favoritesUrl = FlowRouter.path("favorites");
    var invitesUrl = FlowRouter.path("invites");
    var settingsUrl = FlowRouter.path("settings");

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
          primaryText="Your Images"
          leftIconName="image"
          href={yourArtUrl}
        />
        <TopMenuItem
          primaryText="Your Pages"
          leftIconName="import_contacts"
          href={yourBlogUrl}
        />
        <TopMenuItem
          primaryText="Beta Invites"
          leftIconName="weekend"
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

let {
  Menu,
  MenuItem,
  Divider,
  FontIcon
} = mui;

AccountActionsComponent = React.createClass({
  mixins: [OnClickOutside],
  handleClickOutside(event) {
    if (this.props.visible) {
      this.props.action();
    }
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
        <MenuItem
          primaryText="Profile"
          leftIcon={<FontIcon className="material-icons">account_circle</FontIcon>}
          onTouchTap={() => { FlowRouter.go(profileUrl) }}
        />
        <MenuItem
          primaryText="Likes"
          leftIcon={<FontIcon className="material-icons">favorite</FontIcon>}
          onTouchTap={() => { FlowRouter.go(likesUrl) }}
        />
        <MenuItem
          primaryText="Your Art"
          leftIcon={<FontIcon className="material-icons">view_comfy</FontIcon>}
          onTouchTap={() => { FlowRouter.go(yourArtUrl) }}
        />
        <MenuItem
          primaryText="Your Blog"
          leftIcon={<FontIcon className="material-icons">view_list</FontIcon>}
          onTouchTap={() => { FlowRouter.go(yourBlogUrl) }}
        />
        <MenuItem
          primaryText="Beta Invites"
          leftIcon={<FontIcon className="material-icons">weekend</FontIcon>}
          onTouchTap={() => { FlowRouter.go(invitesUrl) }}
        />
        <MenuItem
          primaryText="Settings"
          leftIcon={<FontIcon className="material-icons">settings</FontIcon>}
          onTouchTap={() => { FlowRouter.go(settingsUrl) }}
        />
        <MenuItem>
          <BlazeToReact blazeTemplate="atNavButton"/>
        </MenuItem>
      </Menu>
    </div>;
  }
});

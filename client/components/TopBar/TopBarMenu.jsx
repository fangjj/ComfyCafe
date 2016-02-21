let {
  Menu,
  MenuItem,
  Divider,
  FontIcon
} = mui;

TopBarMenu = React.createClass({
  mixins: [OnClickOutside],
  handleClickOutside(event) {
    if (this.props.open) {
      this.props.onClose();
    }
  },
  render() {
    var classes = "topMenu";
    if (this.props.open) {
      classes = "topMenu active";
    }

    return <div className={classes}>
      <div id="mobileMenuArrow" className={classes}></div>
      <Menu id="mobileMenu" className={classes} autoWidth={false}>
        <MenuItem
          primaryText="Art"
          leftIcon={<FontIcon className="material-icons">palette</FontIcon>}
          onTouchTap={() => { FlowRouter.go(FlowRouter.path("art")) }}
        />
        <MenuItem
          primaryText="Blog"
          leftIcon={<FontIcon className="material-icons">import_contacts</FontIcon>}
          onTouchTap={() => { FlowRouter.go(FlowRouter.path("blog")) }}
        />
        <MenuItem
          primaryText="Tags"
          leftIcon={<FontIcon className="material-icons">style</FontIcon>}
          onTouchTap={() => { FlowRouter.go(FlowRouter.path("pizza")) }}
        />
        <Divider />
        <MenuItem
          primaryText="Explore"
          leftIcon={<FontIcon className="material-icons">explore</FontIcon>}
          onTouchTap={() => { FlowRouter.go(FlowRouter.path("explore")) }}
        />
      </Menu>
    </div>;
  }
});

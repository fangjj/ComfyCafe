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
        <TopMenuItem
          primaryText="Art"
          leftIconName="palette"
          href={FlowRouter.path("art")}
        />
        <TopMenuItem
          primaryText="Blog"
          leftIconName="import_contacts"
          href={FlowRouter.path("blog")}
        />
        <TopMenuItem
          primaryText="Tags"
          leftIconName="style"
          href={FlowRouter.path("pizza")}
        />
        <Divider />
        <TopMenuItem
          primaryText="Explore"
          leftIconName="explore"
          href={FlowRouter.path("explore")}
        />
      </Menu>
    </div>;
  }
});

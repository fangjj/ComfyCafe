let {
  Menu,
  MenuItem,
  Divider,
  FontIcon
} = mui;

let style = {
  menu: {
    position: "fixed",
    left: "19px",
    top: "45px",
    zIndex: 100,
    borderRadius: 0
  }
};

TopBarMenu = React.createClass({
  mixins: [OnClickOutside],
  handleClickOutside(event) {
    if (this.props.open) {
      this.props.onClose();
    }
  },
  render() {
    style.menu.display = (this.props.open ? "block" : "none");
    return <Menu id="mobileMenu" style={style.menu}>
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
    </Menu>;
  }
});

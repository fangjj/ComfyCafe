TopBarTagButton = React.createClass({
  render() {
    return <NavItem
      label="Tags"
      iconName="style"
      href={FlowRouter.path("pizza")}
      className="hide-on-small-only" 
    />;
  }
});
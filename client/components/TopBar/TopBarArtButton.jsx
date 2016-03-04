TopBarArtButton = React.createClass({
  render() {
    return <NavItem
      label="Images"
      iconName="image"
      href={FlowRouter.path("art")}
      className="hide-on-small-only"
    />;
  }
});

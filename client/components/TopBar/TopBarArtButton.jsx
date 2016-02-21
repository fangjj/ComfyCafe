TopBarArtButton = React.createClass({
  render() {
    return <NavItem 
      label="Art"
      iconName="palette"
      href={FlowRouter.path("art")}
    />;
  }
});

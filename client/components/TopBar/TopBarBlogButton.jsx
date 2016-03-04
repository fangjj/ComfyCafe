TopBarBlogButton = React.createClass({
  render() {
    return <NavItem
      label="Pages"
      iconName="import_contacts"
      href={FlowRouter.path("blog")}
      className="hide-on-small-only"
    />;
  }
});

TopBarBlogButton = React.createClass({
  render() {
    return <NavItem
      label="Blog"
      iconName="import_contacts"
      href={FlowRouter.path("blog")}
    />;
  }
});

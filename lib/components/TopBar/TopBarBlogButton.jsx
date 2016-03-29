import React from "react";

TopBarBlogButton = React.createClass({
  render() {
    return <NavItem
      label="Blog"
      iconName="weekend"
      href={FlowRouter.path("blog")}
      className="hide-on-small-only"
    />;
  }
});

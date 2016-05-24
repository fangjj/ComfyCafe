import React from "react";

import VisibilityLink from "/imports/ui/components/VisibilityLink";

export default React.createClass({
  render() {
    const page = this.props.page;
    const path = FlowRouter.path("page", {
      username: page.owner.username,
      slug: page.slug
    });
    return <li>
      <VisibilityLink href={path} visibility={page.visibility}>
        {page.name}
      </VisibilityLink>
    </li>;
  }
});

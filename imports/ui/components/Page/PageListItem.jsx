import React from "react";

import VisibilityLink from "/imports/ui/components/VisibilityLink";
import PageMoreMenu from "/imports/ui/components/Page/PageMoreMenu";

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
      <PageMoreMenu page={page} />
    </li>;
  }
});

import React from "react";

import FilterMoreMenu from "/imports/ui/components/Filter/FilterMoreMenu";

export default React.createClass({
  render() {
    const filter = this.props.filter;
    const path = FlowRouter.path("filter", {
      username: filter.owner.username,
      slug: filter.slug
    });
    return <li>
      <a href={path}>
        {filter.name}
      </a>
      <FilterMoreMenu filter={filter} />
    </li>;
  }
});

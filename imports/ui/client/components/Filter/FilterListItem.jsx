import React from "react";

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
    </li>;
  }
});

import React from "react";

TagListItem = React.createClass({
  render() {
    const tag = this.props.tag;
    const tagUrl = FlowRouter.path("tag", {tagName: tag.name});
    return <li>
      <a href={tagUrl}>
        {tag.name}
      </a>
    </li>;
  }
});

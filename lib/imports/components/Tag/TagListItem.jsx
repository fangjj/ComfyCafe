import React from "react";

const TagListItem = React.createClass({
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

export default TagListItem;

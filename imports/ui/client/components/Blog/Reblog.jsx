import React from "react";

import BlogListItem from "/imports/ui/client/components/Blog/BlogListItem";

export default (props) => {
  if (! props.post) {
    return null;
  }

  return <BlogListItem post={props.post} isChild={true} />;
};

import _ from "lodash";
import React from "react";

import BlogListItem from "/imports/ui/components/Blog/BlogListItem";

export default (props) => {
  if (! props.reblogOf) {
    return null;
  }

  const post = _.reduce(
    props.reblogData,
    (result, v, k) => {
      if (v._id === props.reblogOf) {
        return v;
      } return result;
    },
    null
  );

  return <BlogListItem post={post} isChild={true} reblogData={props.reblogData} />;
};

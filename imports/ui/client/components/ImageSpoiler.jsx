import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";

const labels = [
  "Spoiler",
  "Risqué",
  "Nudity!",
  "This is porn."
];

export default (props) => {
  const { className, safety, ...leftoverProps } = props;
  const classes = classConcat("spoiler level" + safety, className);
  return <div className={classes} {...leftoverProps}>
    {labels[safety]}
  </div>;
};

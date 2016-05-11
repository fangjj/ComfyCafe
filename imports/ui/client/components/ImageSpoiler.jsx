import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
import fancyCommaJoin from "/imports/api/common/fancyCommaJoin";

const labels = [
  "Spoilered",
  "Risqué",
  "Nudity!",
  "This is porn."
];

function renderSub(reason, safety) {
  if (reason) {
    return <div className="sub">{labels[safety]}</div>;
  }
}

export default (props) => {
  prettyPrint(props);
  let { className, safety, reason, ...leftoverProps } = props;
  if (reason) {
    reason = fancyCommaJoin(reason);
  }
  const classes = classConcat("spoiler level" + safety, className);
  return <div className={classes} {...leftoverProps}>
    <div className="reason">{reason || labels[safety] || labels[0]}</div>
    {renderSub(reason, safety)}
  </div>;
};

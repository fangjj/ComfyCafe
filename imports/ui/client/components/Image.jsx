import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";

export default React.createClass({
  render() {
    const { className, filter, ...leftoverProps } = this.props;
    const classes = classConcat(className, "filter-" + filter || "none");
    return <img className={classes} {...leftoverProps} />;
  }
});

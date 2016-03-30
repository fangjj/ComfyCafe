import React from "react";

import classConcat from "/imports/api/common/classConcat";

import Scrollable from "./Scrollable";

export default React.createClass({
  render() {
    const classes = classConcat("col", this.props.className);
    return <Scrollable className={classes}>
      {this.props.children}
    </Scrollable>;
  }
});

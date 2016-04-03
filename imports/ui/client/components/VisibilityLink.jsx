import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";

export default React.createClass({
  render() {
    const classes = classConcat("visibility", this.props.visibility);
    return <a href={this.props.href} className={classes}>
      {this.props.children}
    </a>;
  }
});

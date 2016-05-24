import React from "react";

import classConcat from "/imports/ui/utils/classConcat";

let Ps;
if (Meteor.isClient) {
  Ps = require("perfect-scrollbar");
}

export default React.createClass({
  componentDidMount() {
    Ps.initialize(this.refs.container);
  },
  componentDidUpdate() {
    Ps.update(this.refs.container);
  },
  componentWillUnmount() {
    if (Ps) {
      Ps.destroy(this.refs.container);
    }
  },
  render() {
    const { className, children, ...leftoverProps } = this.props;
    const classes = classConcat("scrollable", className);
    return <div ref="container" className={classes} {...leftoverProps}>
      {children}
    </div>;
  }
});

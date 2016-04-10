import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";

const Ps = expr(() => {
  if (Meteor.isClient) {
    return require("perfect-scrollbar");
  }
});

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

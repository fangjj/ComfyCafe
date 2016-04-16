import React from "react";
import Ps from "perfect-scrollbar";

import classConcat from "/imports/ui/client/utils/classConcat";

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

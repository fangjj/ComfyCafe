import React from "react";

import classConcat from "/imports/api/common/classConcat";

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
    const classes = classConcat("scrollable", this.props.className);
    return <div ref="container" className={classes}>
      {this.props.children}
    </div>;
  }
});

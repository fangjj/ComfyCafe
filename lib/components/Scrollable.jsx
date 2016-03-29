import React from "react";

if (Meteor.isClient) {
  const Ps = require("perfect-scrollbar");
}

Scrollable = React.createClass({
  componentDidMount() {
    Ps.initialize(this.refs.container);
  },
  componentDidUpdate() {
    Ps.update(this.refs.container);
  },
  componentWillUnmount() {
    Ps.destroy(this.refs.container);
  },
  render() {
    const classes = classConcat("scrollable", this.props.className);
    return <div ref="container" className={classes}>
      {this.props.children}
    </div>;
  }
});

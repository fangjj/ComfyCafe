import _ from "lodash";
import React from "react";

import classConcat from "/imports/ui/utils/classConcat";

export default React.createClass({
  getInitialState() {
    return {};
  },
  componentDidMount() {
    this.handleScrollThrottled = _.throttle(this.handleScroll, 100);
    window.addEventListener("scroll", this.handleScrollThrottled);
  },
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScrollThrottled);
  },
  handleScroll(e) {
    const scroll = $(window).scrollTop();
    const winHeight = $(window).height();
    const docHeight = $(document).height();
    const threshold = this.props.threshold || 0;
    if (scroll + winHeight >= docHeight - threshold) {
      console.log("♫");
      this.props.onInfinite();
    }
  },
  render() {
    const { className, children, threshold, onInfinite, ...leftoverProps } = this.props;
    const classes = classConcat("infinite", className);
    return <div className={classes} {...leftoverProps}>
      {children}
    </div>;
  }
});

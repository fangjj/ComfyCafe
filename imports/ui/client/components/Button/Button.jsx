import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import Ripple from "/imports/ui/client/components/Ripple";
import FocusRipple from "/imports/ui/client/components/FocusRipple";

export default React.createClass({
  getInitialState() {
    return { focused: false };
  },
  handleFocus(e) {
    this.setState({ focused: true });
    if (this.onFocus) {
      this.onFocus(e);
    }
  },
  handleBlur(e) {
    this.setState({ focused: false });
    if (this.onBlur) {
      this.onBlur(e);
    }
  },
  render() {
    const { className, iconName, label, onFocus, onBlur, ...leftoverProps } = this.props;
    this.onFocus = onFocus;
    this.onBlur = onBlur;
    const classes = classConcat("button", className);
    return <button
      className={classes}
      onFocus={this.handleFocus}
      onBlur={this.handleBlur}
      {...leftoverProps}
    >
      <Ripple>
        <Icon>{iconName}</Icon>
        <div className="label">
          {label}
        </div>
      </Ripple>
      <FocusRipple show={this.state.focused} />
    </button>;
  }
});

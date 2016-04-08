import _ from "lodash";
import React from "react";

import ProgressBar from "/imports/ui/client/components/ProgressBar";

export default React.createClass({
  handleTouch(e) {
    this.props.onSelect(this.props.upload._id);
  },
  render() {
    let classes;
    if (this.props.upload.progress === 100) {
      classes = "complete";
    }
    return <li className={classes} onTouchTap={this.handleTouch}>
      <div className="label">{this.props.upload.name}</div>
      <ProgressBar className="progress" value={this.props.upload.progress} />
    </li>;
  }
});

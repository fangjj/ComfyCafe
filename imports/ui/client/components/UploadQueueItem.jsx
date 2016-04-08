import _ from "lodash";
import React from "react";

import ProgressBar from "/imports/ui/client/components/ProgressBar";
import Icon from "/imports/ui/client/components/Daikon/Icon";

import {
  IconButton
} from "material-ui";

export default React.createClass({
  handleTouch(e) {
    this.props.onSelect(this.props.upload._id);
  },
  handleDelete(e) {
    e.stopPropagation();
    this.props.onDelete(this.props.upload._id);
  },
  render() {
    let classes;
    if (this.props.upload.progress === 100) {
      classes = "complete";
    }
    return <li className={classes} onTouchTap={this.handleTouch}>
      <div className="label">{this.props.upload.name}</div>
      <ProgressBar className="progress" value={this.props.upload.progress} />
      <IconButton className="delete" onTouchTap={this.handleDelete}>
        <Icon>close</Icon>
      </IconButton>
    </li>;
  }
});

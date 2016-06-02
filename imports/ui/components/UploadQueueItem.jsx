import _ from "lodash";
import React from "react";
import IconButton from "material-ui/IconButton";

import ProgressBar from "/imports/ui/components/ProgressBar";
import Icon from "/imports/ui/components/Daikon/Icon";

export default React.createClass({
  handleTouch(e) {
    if (this.props.upload.progress === 100) {
      this.props.onSelect(this.props.upload._id);
    }
  },
  handleDelete(e) {
    e.stopPropagation();
    this.props.onDelete(this.props.upload._id);
  },
  renderImage() {
    return <img src={this.props.upload.url} />;
  },
  renderVideo() {
    return <video src={this.props.upload.url}>
      <source src={this.props.upload.url} type={this.props.upload.type} />
    </video>;
  },
  renderAudio() {
    return <audio src={this.props.upload.url}>
      <source src={this.props.upload.url} type={this.props.upload.type} />
    </audio>;
  },
  renderPreview() {
    if (this.props.upload.url) {
      const contentType = this.props.upload.type.split("/")[0];
      return _.get({
        image: this.renderImage,
        video: this.renderVideo,
        audio: this.renderAudio
      }, contentType, () => <div />)();
    }
  },
  render() {
    let classes;
    if (this.props.upload.progress === 100) {
      classes = "complete";
    }
    return <li className={classes} onTouchTap={this.handleTouch}>
      <div className="row">
        <div className="preview">
          {this.renderPreview()}
        </div>
        <div className="label">{this.props.upload.name}</div>
        <IconButton className="delete" onTouchTap={this.handleDelete}>
          <Icon>close</Icon>
        </IconButton>
      </div>
      <ProgressBar className="progress" value={this.props.upload.progress} />
    </li>;
  }
});

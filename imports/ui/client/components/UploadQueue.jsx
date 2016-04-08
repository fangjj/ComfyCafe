import _ from "lodash";
import React from "react";

import UploadQueueItem from "/imports/ui/client/components/UploadQueueItem";

export default React.createClass({
  renderQueue() {
    return _.map(this.props.queue, (upload, key) => {
      return <UploadQueueItem
        upload={upload}
        onSelect={this.props.onSelect}
        key={key}
      />;
    });
  },
  render() {
    return <ul className="uploadQueue">
      {this.renderQueue()}
    </ul>;
  }
});

import _ from "lodash";
import React from "react";

import UploadQueueItem from "/imports/ui/client/components/UploadQueueItem";
import Scrollable from "/imports/ui/client/components/Scrollable";

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
  renderPreQueue() {
    return _.map(this.props.preQueue, (upload, key) => {
      return <UploadQueueItem
        upload={upload}
        onSelect={this.props.onSelect}
        key={key}
      />;
    });
  },
  render() {
    return <Scrollable className="uploadQueue">
      <ul>
        {this.renderQueue()}
        {this.renderPreQueue()}
      </ul>
    </Scrollable>;
  }
});

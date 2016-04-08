import _ from "lodash";
import React from "react";

import UploadQueueItem from "/imports/ui/client/components/UploadQueueItem";
import Scrollable from "/imports/ui/client/components/Scrollable";

export default React.createClass({
  renderQueue(queue) {
    return _.map(queue, (upload, key) => {
      return <UploadQueueItem
        upload={upload}
        onSelect={this.props.onSelect}
        onDelete={this.props.onDelete}
        key={key}
      />;
    });
  },
  render() {
    return <Scrollable className="uploadQueue">
      <ul>
        {this.renderQueue(this.props.queue)}
        {this.renderQueue(this.props.preQueue)}
      </ul>
    </Scrollable>;
  }
});

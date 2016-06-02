import _ from "lodash";
import React from "react";

import Scrollable from "/imports/ui/components/Scrollable";
import List from "/imports/ui/components/List";
import UploadQueueItem from "/imports/ui/components/UploadQueueItem";

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
      <List>
        {this.renderQueue(this.props.queue)}
        {this.renderQueue(this.props.preQueue)}
      </List>
    </Scrollable>;
  }
});

import React from "react";

import media from "/imports/api/media/collection";
import FAB from "/imports/ui/components/FAB";

export default React.createClass({
  componentDidMount() {
    media.resumable.assignBrowse(this.refs.addFile);
  },
  render() {
    return <FAB iconName="add">
      <label className="addFile">
        <input type="file" title="" ref="addFile"
          accept=".gif,.jpg,.jpeg,.png,.mp4,.ogv,.webm,.mp3,.ogg"
        />
      </label>
    </FAB>;
  }
});

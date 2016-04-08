import React from "react";

import media from "/imports/api/media/collection";

import FAB from "/imports/ui/client/components/FAB";

export default React.createClass({
  componentDidMount() {
    media.resumable.assignBrowse(this.refs.addFile);
  },
  render() {
    return <FAB iconName="add">
      <input className="addFile" type="file" title="" ref="addFile" />
    </FAB>;
  }
});

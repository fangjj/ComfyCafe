import React from "react";

import Ripple from "/imports/ui/client/components/Ripple";

export default React.createClass({
  select() {
    this.props.onSelect(this.props.album._id);
  },
  render() {
    const album = this.props.album;
    return <li onTouchTap={this.select}>
      <Ripple>
        <div className="title">
          {album.name}
        </div>
        <div className="undertitle">
          {album.slug}
        </div>
      </Ripple>
    </li>;
  }
});

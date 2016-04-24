import React from "react";

import Ripple from "/imports/ui/client/components/Ripple";

export default React.createClass({
  select() {
    this.props.onSelect(this.props.album._id);
  },
  handleLink(e) {
    e.stopPropagation();
  },
  render() {
    const album = this.props.album;
    const path = FlowRouter.path("album", {
      username: album.owner.username,
      albumSlug: album.slug
    });
    return <li onTouchTap={this.select}>
      <Ripple>
        <div className="title">
          {album.name}
        </div>
        <div className="undertitle">
          <a href={path} onTouchTap={this.handleLink}>{album.slug}</a>
        </div>
      </Ripple>
    </li>;
  }
});

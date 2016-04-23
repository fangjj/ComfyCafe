import React from "react";

export default React.createClass({
  render() {
    const album = this.props.album;
    const path = FlowRouter.path("album", {
      username: album.owner.username,
      albumSlug: album.slug
    });
    return <li><a href={path}>{album.name}</a></li>;
  }
});

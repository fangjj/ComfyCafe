import React from "react";

import VisibilityLink from "/imports/ui/components/VisibilityLink";
import AlbumMoreMenu from "/imports/ui/components/Album/AlbumMoreMenu";

export default React.createClass({
  render() {
    const album = this.props.album;
    const path = FlowRouter.path("album", {
      username: album.owner.username,
      albumSlug: album.slug
    });
    return <li>
      <VisibilityLink href={path} visibility={album.visibility}>
        {album.name}
      </VisibilityLink>
      <AlbumMoreMenu album={album} />
    </li>;
  }
});

import React from "react";

import DenseContent from "/imports/ui/client/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";
import Err404 from "/imports/ui/client/components/Err404";
import AlbumForm from "/imports/ui/client/components/Album/AlbumForm";

export default React.createClass({
  render() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    const album = this.props.album;
    if (! album) {
      return <Err404 />;
    }

    const url = FlowRouter.path("album", {
      username: album.owner.username,
      albumSlug: album.slug
    });
    const ownerUrl = FlowRouter.path("profile", { username: album.owner.username });
    return <DenseContent>
      <header>
        <h2><a href={ownerUrl}>{album.owner.username}</a>/<a href={url}>{album.name}</a></h2>
      </header>
      <AlbumForm album={album} mod={true} actions={true} />
    </DenseContent>;
  }
});

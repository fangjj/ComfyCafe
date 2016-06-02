import React from "react";

import DenseContent from "/imports/ui/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import Err404 from "/imports/ui/components/Err404";
import RoomForm from "/imports/ui/components/Chat/RoomForm";

export default React.createClass({
  render() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    const community = this.props.community;
    if (! community) {
      return <Err404 />;
    }

    const url = FlowRouter.path("room", { roomSlug: community.slug });
    return <DenseContent>
      <header>
        <h2><a href={url}>{community.name}</a></h2>
      </header>
      <RoomForm room={community} mod={true} actions={true} />
    </DenseContent>;
  }
});

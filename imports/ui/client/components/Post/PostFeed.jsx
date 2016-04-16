import React from "react";

import PostGalleryContainer from "./PostGalleryContainer";
import InlineUhoh from "/imports/ui/client/components/InlineUhoh";

export default React.createClass({
  render() {
    return <PostGalleryContainer
      subName="postFeed"
      requireAuth={true}
      generateDoc={function () {
        let subs = [];
        if (Meteor.userId()) {
          subs = Meteor.user().subscriptions || [];
        }
        return { $or: [
          { "owner._id": Meteor.userId() },
          { "owner._id": { $in: subs } }
        ] };
      }}
      ifEmpty={function () {
        let msg;
        if (this.props.currentUser.subscriptions && this.props.currentUser.subscriptions.length) {
          msg = "None of your subscriptions have posted anything...";
        } else {
          msg = "You haven't subscribed to anyone!";
        }
        return <InlineUhoh>
          {msg}
        </InlineUhoh>;
      }}
    />;
  }
});

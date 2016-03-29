import React from "react";

PostFeed = React.createClass({
  render() {
    return <PostGallery
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
        if (this.data.currentUser.subscriptions && this.data.currentUser.subscriptions.length) {
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

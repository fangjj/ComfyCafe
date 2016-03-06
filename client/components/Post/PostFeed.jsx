PostFeed = React.createClass({
  render() {
    return <PostGallery
      subName="postFeed"
      requireAuth={true}
      generateDoc={function () {
        return { $or: [
          { "owner._id": Meteor.userId() },
          { "owner._id": { $in: Meteor.user() && (Meteor.user().subscriptions || []) } }
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

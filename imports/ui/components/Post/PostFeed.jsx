import _ from "lodash";
import React from "react";

import defaultMeta from "/imports/ui/utils/defaultMeta";
import legitBool from "/imports/ui/utils/legitBool";
import PostGalleryContainer from "./PostGalleryContainer";
import InlineUhoh from "/imports/ui/components/InlineUhoh";

export default React.createClass({
  componentWillMount() {
    defaultMeta();
  },
  render() {
    return <PostGalleryContainer
      subName="postFeed"
      requireAuth={true}
      generateDoc={() => {
        const subs = _.get(Meteor.user(), "subscriptions", []);
        return {
          legit: legitBool(this.props.legit),
          $or: [
            { "owner._id": Meteor.userId() },
            { "owner._id": { $in: subs } }
          ]
        };
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

import React from "react";

import Posts from "/imports/api/posts/collection";
import ImageView from "./ImageView";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const postId = FlowRouter.getParam("id");
    const handle = Meteor.subscribe("adminPost", Meteor.userId(), postId);
    return {
      loading: ! handle.ready(),
      image: Posts.findOne({ _id: postId })
    };
  },
  render() {
    if (this.data.loading) {
      return <DenseLoadingSpinner />;
    }
    return <ImageView {...this.data} />;
  }
});

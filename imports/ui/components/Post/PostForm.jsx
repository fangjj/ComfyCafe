import React from "react";

import "/imports/api/posts/methods";

import PostDialog from "./PostDialog";

const PostForm = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("media", Meteor.userId());
    return {
      loading: ! handle.ready(),
      medium: media.findOne({ _id: new Mongo.ObjectID(this.props.mediumId) }),
      currentUser: Meteor.user()
    };
  },
  handleSubmit(data) {
    Meteor.call("addPost", this.props.mediumId, data, (err, name) => {
      this.props.destroy();
      var path = FlowRouter.path("post", {
        username: this.data.currentUser.username,
        postName: name
      });
      var actions = {
        redirect() { FlowRouter.go(path) },
        tab() { window.open(path) },
        nothing() {}
      }[this.data.currentUser.settings.uploadAction || "redirect"]();
    });
  },
  render() {
    if (this.data.loading) {
      return <RainbowSpinnerComponent />;
    }

    return <PostDialog
      title="Create Post"
      open={this.props.open}
      modal={false}
      handleClose={this.props.handleClose}
      handleSubmit={this.handleSubmit}
      medium={this.data.medium}
    />;
  }
});

export default PostForm;

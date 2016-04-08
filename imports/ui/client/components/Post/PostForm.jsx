import React from "react";

import "/imports/api/posts/methods";
import media from "/imports/api/media/collection";

import PostDialog from "./PostDialog";
import RainbowSpinner from "/imports/ui/client/components/Spinner/RainbowSpinner";

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
      if (! err) {
        if (this.props.onSuccess) {
          this.props.onSuccess();
        }
        this.props.destroy();
        const path = FlowRouter.path("post", {
          username: this.data.currentUser.username,
          postName: name
        });
        const actions = {
          redirect() { FlowRouter.go(path) },
          tab() { window.open(path) },
          nothing() {}
        }[this.data.currentUser.settings.uploadAction || "redirect"]();
      } else {
        prettyPrint(err);
      }
    });
  },
  render() {
    if (this.data.loading) {
      return <RainbowSpinner />;
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

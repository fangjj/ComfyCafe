import React from "react";

import "/imports/api/posts/methods";
import media from "/imports/api/media/collection";

import PostDialog from "./PostDialog";
import RainbowSpinner from "/imports/ui/client/components/Spinner/RainbowSpinner";

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    if (! this.props.post) {
      const handle = Meteor.subscribe("media", Meteor.userId());
      return {
        loading: ! handle.ready(),
        medium: media.findOne({ _id: new Mongo.ObjectID(this.props.mediumId) }),
        currentUser: Meteor.user()
      };
    } else {
      return { loading: false };
    }
  },
  handleSubmit(data, callback) {
    if (this.props.post) {
      Meteor.call("addPost", this.props.mediumId, data, (err, name) => {
        if (! err) {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
          this.props.onClose();

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

        callback();
      });
    } else {
      Meteor.call("updatePost", this.props.post._id, data, (err) => {});
      this.props.handleClose();
    }
  },
  render() {
    if (this.data.loading) {
      return <RainbowSpinner />;
    }

    let title = "Create Post";
    if (this.props.post) {
      title = "Edit Post";
    }

    return <PostDialog
      title={title}
      post={this.props.post}
      medium={this.data.medium}
      open={this.props.open}
      modal={false}
      handleClose={this.props.onClose}
      handleSubmit={this.handleSubmit}
    />;
  }
});

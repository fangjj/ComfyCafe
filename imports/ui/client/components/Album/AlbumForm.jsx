import React from "react";

import "/imports/api/albums/methods";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import TextArea from "/imports/ui/client/components/TextArea";
import VisibilitySelector from "/imports/ui/client/components/VisibilitySelector";

const defaultState = {
  name: "",
  posts: [],
  visibility: "public",
  description: ""
};

export default React.createClass({
  getInitialState() {
    return _.defaults(_.pick(this.props.album, _.keys(defaultState)), defaultState);
  },
  handleName(e) {
    this.setState({ name: e.target.value });
  },
  handlePosts(e) {
    this.setState({ posts: commaSplit(e.target.value) });
  },
  handleVisibility(value) {
    this.setState({ visibility: value });
  },
  handleDescription(e) {
    this.setState({ description: e.target.value });
  },
  redirect(slug) {
    const path = FlowRouter.path("album", {
      username: _.get(this.props, "album.owner.username", this.props.currentUser.username),
      albumSlug: slug
    });
    FlowRouter.go(path);
  },
  handleSubmit() {
    const data = this.state;

    if (! this.props.album) {
      Meteor.call("addAlbum", data, (err, slug) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
          this.redirect(slug);
        }
      });
    } else {
      Meteor.call("updateAlbum", this.props.album._id, data, (err, slug) => {
        if (err) {
          prettyPrint(err);
        } else {
          this.redirect(slug);
        }
      });
    }
  },
  render() {
    return <Form
      id={this.props.id}
      actions={this.props.actions}
      onSubmit={this.handleSubmit}
      onClose={this.props.onClose}
    >
      <TextField
        defaultValue={this.state.name}
        label="Name"
        onChange={this.handleName}
      />
      <TextField
        defaultValue={this.state.posts.join(", ")}
        label="Posts"
        onChange={this.handlePosts}
      />
      <VisibilitySelector
        visibility={this.state.visibility}
        onChange={this.handleVisibility}
      />
      <TextArea
        defaultValue={this.state.description}
        label="Description"
        rows={3}
        rowsMax={7}
        onChange={this.handleDescription}
      />
    </Form>;
  }
});

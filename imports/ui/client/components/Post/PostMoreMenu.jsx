import React from "react";

import "/imports/api/posts/methods";

import PostForm from "./PostForm";
import Icon from "/imports/ui/client/components/Daikon/Icon";

import {
  IconMenu,
  MenuItem,
  IconButton
} from "material-ui";

export default React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showPostForm() {
    this.setState({showForm: true});
  },
  hidePostForm() {
    this.setState({showForm: false});
  },
  reroll() {
    Meteor.call("rerollPost", this.props.post._id);
  },
  delete() {
    Meteor.call("deletePost", this.props.post._id);
  },
  renderForm() {
    if (this.state.showForm) {
      return <PostForm
        post={this.props.post}
        onClose={this.hidePostForm}
        open={this.state.showForm}
      />;
    }
  },
  render() {
    const post = this.props.post;

    const owner = post.owner;
    const isOwner = this.props.currentUser && this.props.currentUser._id === owner._id;

    const moreBtn = <IconButton>
      <Icon>more_horiz</Icon>
    </IconButton>;

    return <div className="more">
      <IconMenu
        iconButtonElement={moreBtn}
        anchorOrigin={{horizontal: "right", vertical: "top"}}
        targetOrigin={{horizontal: "right", vertical: "top"}}
      >
        <MenuItem primaryText="Edit" onTouchTap={this.showPostForm} />
        <MenuItem primaryText="Reroll" onTouchTap={this.reroll} />
        <MenuItem primaryText="Delete" onTouchTap={this.delete} />
      </IconMenu>
      {this.renderForm()}
    </div>;
  }
});

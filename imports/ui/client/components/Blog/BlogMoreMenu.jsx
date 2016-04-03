import React from "react";

import "/imports/api/blog/methods";

import BlogUpdateForm from "./BlogUpdateForm";
import Icon from "/imports/ui/client/components/Daikon/Icon";

import {
  IconMenu,
  MenuItem,
  IconButton
} from "material-ui";

const BlogMoreMenu = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showBlogForm() {
    this.setState({showForm: true});
  },
  hideBlogForm() {
    this.setState({showForm: false});
  },
  delete() {
    Meteor.call("deleteBlogPost", this.props.post._id);
  },
  render() {
    var post = this.props.post;

    var owner = post.owner;
    var isOwner = this.props.currentUser && this.props.currentUser._id === owner._id;

    var moreBtn = <IconButton>
      <Icon>more_horiz</Icon>
    </IconButton>;

    return <div className="more">
      <IconMenu
        iconButtonElement={moreBtn}
        anchorOrigin={{horizontal: "right", vertical: "top"}}
        targetOrigin={{horizontal: "right", vertical: "top"}}
      >
        <MenuItem primaryText="Edit" onTouchTap={this.showBlogForm} />
        <MenuItem primaryText="Delete" onTouchTap={this.delete} />
      </IconMenu>
      <BlogUpdateForm
        post={this.props.post}
        handleClose={this.hideBlogForm}
        open={this.state.showForm}
      />
    </div>;
  }
});

export default BlogMoreMenu;
import React from "react";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";

import "/imports/api/blog/methods";
import BlogForm from "./BlogForm";
import Dialog from "/imports/ui/client/components/Dialog";
import Icon from "/imports/ui/client/components/Daikon/Icon";

export default React.createClass({
  getInitialState() {
    return { showForm: false };
  },
  showBlogForm() {
    this.setState({ showForm: true });
  },
  hideBlogForm() {
    this.setState({ showForm: false });
  },
  delete() {
    Meteor.call("deleteBlogPost", this.props.post._id);
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Edit Blog Post"
        formId={"form" + this.props.post._id}
        open={true}
        onClose={this.hideBlogForm}
      >
        <BlogForm
          id={"form" + this.props.post._id}
          post={this.props.post}
          onClose={this.hideBlogForm}
        />
      </Dialog>;
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
        <MenuItem primaryText="Edit" onTouchTap={this.showBlogForm} />
        <MenuItem primaryText="Delete" onTouchTap={this.delete} />
      </IconMenu>
      {this.renderForm()}
    </div>;
  }
});

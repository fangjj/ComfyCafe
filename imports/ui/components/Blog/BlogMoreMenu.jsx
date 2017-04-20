import React from "react";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";

import "/imports/api/blog/methods";
import BlogForm from "./BlogForm";
import Dialog from "/imports/ui/components/Dialog";
import Icon from "/imports/ui/components/Daikon/Icon";

export default React.createClass({
  getInitialState() {
    return { showForm: false };
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
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
        onClose={this.hideForm}
      >
        <BlogForm
          id={"form" + this.props.post._id}
          post={this.props.post}
          redirect={this.props.solo}
          onClose={this.hideForm}
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
        <MenuItem primaryText="Edit" onClick={this.showForm} />
        <MenuItem primaryText="Delete" onClick={this.delete} />
      </IconMenu>
      {this.renderForm()}
    </div>;
  }
});

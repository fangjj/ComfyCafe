import React from "react";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";

import "/imports/api/posts/methods";
import PostForm from "/imports/ui/client/components/Post/PostForm";
import Dialog from "/imports/ui/client/components/Dialog";
import Icon from "/imports/ui/client/components/Daikon/Icon";

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
  reroll() {
    Meteor.call("rerollPost", this.props.post._id);
  },
  delete() {
    Meteor.call("deletePost", this.props.post._id);
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Edit Post"
        formId={"form" + this.props.post._id}
        open={true}
        onClose={this.hideForm}
      >
        <PostForm
          id={"form" + this.props.post._id}
          post={this.props.post}
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
        <MenuItem primaryText="Edit" onTouchTap={this.showForm} />
        <MenuItem primaryText="Reroll" onTouchTap={this.reroll} />
        <MenuItem primaryText="Delete" onTouchTap={this.delete} />
      </IconMenu>
      {this.renderForm()}
    </div>;
  }
});

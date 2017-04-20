import React from "react";
import MenuItem from "material-ui/MenuItem";

import "/imports/api/albums/methods";
import AlbumForm from "/imports/ui/components/Album/AlbumForm";
import DialogForm from "/imports/ui/components/DialogForm";
import MoreMenu from "/imports/ui/components/MoreMenu";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
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
    Meteor.call("deleteAlbum", this.props.album._id, () => {
      if (this.props.redirect) {
        const path = FlowRouter.path("albumList");
        FlowRouter.go(path);
      }
    });
  },
  renderForm() {
    if (this.state.showForm) {
      return <DialogForm
        title="Edit Page"
        id={"form" + this.props.album._id}
        form={<AlbumForm album={this.props.album} noRedirect={true} />}
        onClose={this.hideForm}
      />;
    }
  },
  render() {
    const album = this.props.album;

    const owner = album.owner;
    const isOwner = this.context.currentUser && this.context.currentUser._id === owner._id;

    if (! isOwner) {
      return null;
    }

    return <MoreMenu form={this.renderForm()}>
      <MenuItem primaryText="Edit" onClick={this.showForm} />
      <MenuItem primaryText="Delete" onClick={this.delete} />
    </MoreMenu>;
  }
});

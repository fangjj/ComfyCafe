import _ from "lodash";
import React from "react";
import OnClickOutside from "react-onclickoutside";
import FlatButton from "material-ui/FlatButton";

import "/imports/api/albums/methods";
import Albums from "/imports/api/albums/collection";
import Scrollable from "/imports/ui/client/components/Scrollable";
import List from "/imports/ui/client/components/List";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import VisibilitySelector from "/imports/ui/client/components/VisibilitySelector";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";
import AlbumSelectorItem from "/imports/ui/client/components/Album/AlbumSelectorItem";

export default React.createClass({
  mixins: [ReactMeteorData, OnClickOutside],
  getInitialState() {
    return {
      showForm: false,
      name: ""
    };
  },
  getMeteorData() {
    const handle = Meteor.subscribe("albumsBy", Meteor.user().username);
    return {
      loading: ! handle.ready(),
      albums: Albums.find(
        { "owner.username": Meteor.user().username },
        { sort: { createdAt: -1, name: 1 } }
      ).fetch(),
      currentUser: Meteor.user()
    };
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
    this.setState({ showForm: false });
  },
  handleClickOutside(e) {
    this.props.onClose();
  },
  handleSelect(albumId) {
    Meteor.call("albumAddPost", albumId, this.props.postId);
  },
  handleRemove(albumId) {
    Meteor.call("albumRemovePost", albumId, this.props.postId);
  },
  handleName(e) {
    this.setState({ name: e.target.value });
  },
  handleSubmit() {
    Meteor.call("addAlbum", {
      name: this.state.name,
      visibility: _.get(this, "data.currentUser.settings.defaultAlbumVisibility", "unlisted"),
      posts: [this.props.postId],
      description: ""
    });
    this.setState({ showForm: false, name: "" });
  },
  renderAlbums() {
    if (this.data.loading) {
      return <InlineLoadingSpinner />;
    }

    return _.map(this.data.albums, (album) => {
      return <AlbumSelectorItem
        album={album}
        postId={this.props.postId}
        onSelect={this.handleSelect}
        onRemove={this.handleRemove}
        key={album._id}
      />;
    });
  },
  renderForm() {
    if (! this.state.showForm) {
      return <FlatButton
        label="New Album"
        icon={<Icon>add</Icon>}
        onTouchTap={this.showForm}
      />;
    } else {
      return <Form onSubmit={this.handleSubmit}>
        <TextField
          label="Name"
          onChange={this.handleName}
        />
        <SubmitButton
          type="submit"
          label="Create"
          iconName="add"
        />
      </Form>;
    }
  },
  render() {
    return <div className="albumSelector" style={{ left: this.props.anchor }}>
      <Scrollable>
        <List>
          {this.renderAlbums()}
          <li>
            {this.renderForm()}
          </li>
        </List>
      </Scrollable>
    </div>;
  }
});

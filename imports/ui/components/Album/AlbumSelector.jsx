import _ from "lodash";
import React from "react";
import OnClickOutside from "react-onclickoutside";
import FlatButton from "material-ui/FlatButton";

import "/imports/api/albums/methods";
import Albums from "/imports/api/albums/collection";
import Scrollable from "/imports/ui/components/Scrollable";
import List from "/imports/ui/components/List";
import Form from "/imports/ui/components/Form";
import TextField from "/imports/ui/components/TextField";
import VisibilitySelector from "/imports/ui/components/VisibilitySelector";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import Icon from "/imports/ui/components/Daikon/Icon";
import InlineLoadingSpinner from "/imports/ui/components/Spinner/InlineLoadingSpinner";
import AlbumSelectorItem from "/imports/ui/components/Album/AlbumSelectorItem";

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
    const style = {
      left: this.props.offset.left,
      top: this.props.offset.top
    };
    return <div className="albumSelector" style={style}>
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

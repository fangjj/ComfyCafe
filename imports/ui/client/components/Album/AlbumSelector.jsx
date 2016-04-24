import _ from "lodash";
import React from "react";
import OnClickOutside from "react-onclickoutside";
import FlatButton from "material-ui/FlatButton";

import "/imports/api/albums/methods";
import Albums from "/imports/api/albums/collection";
import Scrollable from "/imports/ui/client/components/Scrollable";
import List from "/imports/ui/client/components/List";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";
import AlbumSelectorItem from "/imports/ui/client/components/Album/AlbumSelectorItem";

export default React.createClass({
  mixins: [ReactMeteorData, OnClickOutside],
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
  handleClickOutside(e) {
    this.props.onClose();
  },
  handleSelect(albumId) {
    Meteor.call("albumAddPost", albumId, this.props.postId);
  },
  renderAlbums() {
    if (this.data.loading) {
      return <InlineLoadingSpinner />;
    }

    return _.map(this.data.albums, (album) => {
      return <AlbumSelectorItem album={album} onSelect={this.handleSelect} key={album._id} />;
    });
  },
  render() {
    return <div className="albumSelector" style={{ left: this.props.anchor }}>
      <Scrollable>
        <List>
          {this.renderAlbums()}
        </List>
      </Scrollable>
      <div>
        <FlatButton
          label="New Album"
          icon={<Icon>add</Icon>}
          onTouchTap={this.handleNew}
        />
      </div>
    </div>;
  }
});

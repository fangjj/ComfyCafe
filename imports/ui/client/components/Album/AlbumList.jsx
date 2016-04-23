import _ from "lodash";
import React from "react";

import Content from "/imports/ui/client/components/Content";
import List from "/imports/ui/client/components/List";
import FAB from "/imports/ui/client/components/FAB";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";
import AlbumListItem from "/imports/ui/client/components/Album/AlbumListItem";

export default React.createClass({
  renderItems() {
    if (this.props.loading) {
      return <InlineLoadingSpinner />;
    }

    return _.map(this.props.albums, (album) => {
      return <AlbumListItem album={album} key={album._id} />;
    });
  },
  render() {
    return <Content>
      <List>
        {this.renderItems()}
      </List>
      <FAB iconName="add" />
    </Content>;
  }
});

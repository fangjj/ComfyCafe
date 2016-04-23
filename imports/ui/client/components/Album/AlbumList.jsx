import _ from "lodash";
import React from "react";

import Content from "/imports/ui/client/components/Content";
import List from "/imports/ui/client/components/List";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";
import InlineUhoh from "/imports/ui/client/components/InlineUhoh";
import FAB from "/imports/ui/client/components/FAB";
import Dialog from "/imports/ui/client/components/Dialog";
import AlbumForm from "/imports/ui/client/components/Album/AlbumForm";
import AlbumListItem from "/imports/ui/client/components/Album/AlbumListItem";

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
  renderItems() {
    if (this.props.loading) {
      return <InlineLoadingSpinner />;
    }

    if (this.props.albums.length) {
      return _.map(this.props.albums, (album) => {
        return <AlbumListItem album={album} key={album._id} />;
      });
    } else {
      return <InlineUhoh>
        {FlowRouter.getParam("username") + " hasn't created any albums yet!"}
      </InlineUhoh>;
    }
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Create Album"
        formId="formNewAlbum"
        open={true}
        onClose={this.hideForm}
      >
        <AlbumForm
          id="formNewAlbum"
          onClose={this.hideForm}
        />
      </Dialog>;
    }
  },
  render() {
    return <Content>
      <List>
        {this.renderItems()}
      </List>
      <FAB iconName="add" onTouchTap={this.showForm} />
      {this.renderForm()}
    </Content>;
  }
});

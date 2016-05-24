import _ from "lodash";
import React from "react";

import Content from "/imports/ui/components/Content";
import List from "/imports/ui/components/List";
import LoadingSpinner from "/imports/ui/components/Spinner/LoadingSpinner";
import InlineLoadingSpinner from "/imports/ui/components/Spinner/InlineLoadingSpinner";
import InlineUhoh from "/imports/ui/components/InlineUhoh";
import FAB from "/imports/ui/components/FAB";
import Dialog from "/imports/ui/components/Dialog";
import AlbumForm from "/imports/ui/components/Album/AlbumForm";
import AlbumListItem from "/imports/ui/components/Album/AlbumListItem";

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
          currentUser={this.props.currentUser}
          onClose={this.hideForm}
        />
      </Dialog>;
    }
  },
  render() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    return <Content>
      <List>
        {this.renderItems()}
      </List>
      <FAB iconName="add" onTouchTap={this.showForm} />
      {this.renderForm()}
    </Content>;
  }
});

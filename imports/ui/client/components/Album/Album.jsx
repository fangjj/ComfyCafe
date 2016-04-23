import React from "react";

import setTitle from "/imports/api/common/setTitle";
import Content from "/imports/ui/client/components/Content";
import Medium from "/imports/ui/client/components/Medium";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";
import FAB from "/imports/ui/client/components/FAB";
import Dialog from "/imports/ui/client/components/Dialog";
import AlbumForm from "/imports/ui/client/components/Album/AlbumForm";

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
  renderPosts(album) {
    if (this.props.postsLoading) {
      return <InlineLoadingSpinner />;
    }

    return _.map(this.props.posts, (post) => {
      return <figure key={post._id}>
        <Medium
          medium={post.medium}
          filter={post.pretentiousFilter}
        />
      </figure>;
    });
  },
  renderForm(album) {
    if (this.state.showForm) {
      return <Dialog
        title="Edit Album"
        formId={"form" + album._id}
        open={true}
        onClose={this.hideForm}
      >
        <AlbumForm
          id={"form" + album._id}
          album={album}
          onClose={this.hideForm}
        />
      </Dialog>;
    }
  },
  render() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    const album = this.props.album;
    setTitle(album.name);

    return <Content>
      <header>
        <h2>{album.name}</h2>
      </header>
      {this.renderPosts(album)}
      <FAB iconName="edit" onTouchTap={this.showForm} />
      {this.renderForm(album)}
    </Content>;
  }
});

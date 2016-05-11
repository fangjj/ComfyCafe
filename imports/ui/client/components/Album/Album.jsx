import _ from "lodash";
import React from "react";

import setTitle from "/imports/api/common/setTitle";
import Content from "/imports/ui/client/components/Content";
import Medium from "/imports/ui/client/components/Medium";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";
import FAB from "/imports/ui/client/components/FAB";
import Dialog from "/imports/ui/client/components/Dialog";
import AlbumForm from "/imports/ui/client/components/Album/AlbumForm";
import FlexHead from "/imports/ui/client/components/FlexHead";
import InlineTopic from "/imports/ui/client/components/Chat/InlineTopic";

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
    if (this.props.postsLoading || this.props.filterLoading) {
      return <InlineLoadingSpinner />;
    }

    return _.map(album.posts, (postId) => {
      return _.reduce(
        this.props.posts,
        (result, post) => {
          if (post._id === postId) {
            result = <figure key={post._id}>
              <Medium
                medium={post.medium}
                safety={post.safety}
                spoilered={_.has(this.props.spoilered, post._id)}
                reason={_.get(this.props.spoilered, post._id)}
              />
            </figure>;
          }
          return result;
        },
        null
      );
    });
  },
  renderFab(isOwner) {
    if (isOwner) {
      return <FAB iconName="edit" onTouchTap={this.showForm} />;
    }
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
    if (this.props.loading || ! this.props.album) {
      return <LoadingSpinner />;
    }

    const album = this.props.album;
    setTitle(album.name);

    const owner = album.owner;
    const ownerUrl = FlowRouter.path("profile", { username: owner.username });
    const isOwner = _.get(this.props.currentUser, "_id") === album.owner._id;

    return <article className="album contentLayout">
      <section className="content">
        <header>
          <h2>{album.name}</h2>
        </header>
        {this.renderPosts(album)}
      </section>
      <FlexHead
        className="content"
        item={album}
        sigil="collections"
        verb="Collected"
        body={album.description}
        section={true}
      />
      <section className="comments content">
        <InlineTopic
          topicId={album.topic._id}
          currentUser={this.props.currentUser}
        />
      </section>
      {this.renderFab(isOwner)}
      {this.renderForm(album)}
    </article>;
  }
});

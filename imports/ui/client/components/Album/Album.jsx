import React from "react";

import setTitle from "/imports/api/common/setTitle";
import Content from "/imports/ui/client/components/Content";
import Medium from "/imports/ui/client/components/Medium";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";
import FAB from "/imports/ui/client/components/FAB";
import Dialog from "/imports/ui/client/components/Dialog";
import AlbumForm from "/imports/ui/client/components/Album/AlbumForm";
import Avatar from "/imports/ui/client/components/Avatar/Avatar";
import TextBody from "/imports/ui/client/components/TextBody";
import Moment from "/imports/ui/client/components/Moment";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import PrivacyIcon from "/imports/ui/client/components/Daikon/PrivacyIcon";
import UserLink from "/imports/ui/client/components/User/UserLink";
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
  renderDescription(album) {
    if (album.description) {
      return <TextBody text={album.description} className="body" />;
    }
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
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    const album = this.props.album;
    setTitle(album.name);

    const owner = album.owner;
    const ownerUrl = FlowRouter.path("profile", { username: owner.username });
    const isOwner = this.props.currentUser._id === album.owner._id;

    return <article className="album contentLayout">
      <section className="content">
        <header>
          <h2>{album.name}</h2>
        </header>
        {this.renderPosts(album)}
      </section>
      <section className="infoBox content">
        <div className="flexColumn">
          <div className="flexLayout">
            <div className="leftSide">
              <a href={ownerUrl}>
                <Avatar size="small" user={owner} />
              </a>
            </div>
            <div className="rightSide">
              <div className="top">
                <div className="genericCol">
                  <div className="info">
                    <Icon className="sigil">collections</Icon>
                    Assembled by <UserLink user={owner} /> <Moment time={album.createdAt} />
                  </div>
                  <div className="privacy">
                    <PrivacyIcon privacy={album.visibility} /> {_.capitalize(album.visibility)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this.renderDescription(album)}
        </div>
      </section>
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

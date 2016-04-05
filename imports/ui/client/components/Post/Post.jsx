import _ from "lodash";
import React from "react";

import PostModifyFAB from "./PostModifyFAB";
import PostLikeFAB from "./PostLikeFAB";
import PostLikes from "./PostLikes";
import PostInfoBox from "./PostInfoBox";
import Medium from "../Medium";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import Err404 from "../Err404";
import Content from "../Content";
import AvatarCropper from "../Avatar/AvatarCropper";
import TagTree from "../Tag/TagTree";
import InlineTopic from "../Chat/InlineTopic";
import setPattern from "/imports/ui/client/utils/setPattern";

const Post = React.createClass({
  getInitialState() {
    return {
      avatarCropper: false
    };
  },
  componentWillMount() {
    if (this.props.post) {
      setPattern(this.props.post.name, this.props.post.complement);
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.post) {
      setPattern(nextProps.post.name, nextProps.post.complement);
    }
  },
  showAvatarCropper() {
    this.setState({
      avatarCropper: true
    });
  },
  hideAvatarCropper() {
    this.setState({
      avatarCropper: false
    });
  },
  renderTags() {
    if (this.props.post.tags.text) {
      return <section className="tagBox content">
        <TagTree tags={this.props.post.tags} humanizedTags={this.props.post.humanizedTags} />
      </section>;
    }
  },
  renderLikes() {
    if (this.props.post.likes && this.props.post.likes.length) {
      return <PostLikes likes={this.props.post.likes} />;
    }
  },
  renderAvatarCropper() {
    if (this.state.avatarCropper) {
      const src = "/gridfs/media/" + this.props.post.medium.md5;
      return <Content>
        <AvatarCropper src={src} cancelAction={this.hideAvatarCropper} />
      </Content>;
    }
  },
  render() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    if (! this.props.post) {
      return <Err404 />;
    }

    var isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.post.owner._id;
    var showEditButton = isOwner;
    var showFavoriteButton = ! isOwner && this.props.currentUser && this.props.post.medium;

    var fab;
    if (showEditButton) {
      fab = <PostModifyFAB post={this.props.post} />;
    }
    if (showFavoriteButton) {
      fab = <PostLikeFAB post={this.props.post} userId={this.props.currentUser._id} />;
    }

    return <article className="post contentLayout">
      <figure className="content">
        <Medium
          medium={this.props.post.medium}
          pretentiousFilter={this.props.post.pretentiousFilter}
        />
      </figure>
      <PostInfoBox
        post={this.props.post}
        currentUser={this.props.currentUser}
        showAvatarCropper={this.showAvatarCropper}
      />
      {this.renderAvatarCropper()}
      {this.renderTags()}
      <section className="comments content">
        <InlineTopic
          topicId={this.props.post.topic._id}
          currentUser={this.props.currentUser}
        />
      </section>
      {this.renderLikes()}
      {fab}
    </article>;
  }
});

export default Post;

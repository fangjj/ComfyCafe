import _ from "lodash";
import React from "react";

import { getMediaUrlMD5 } from "/imports/api/media/urls";
import setPattern from "/imports/ui/client/utils/setPattern";
import PostLikes from "./PostLikes";
import PostInfoBox from "./PostInfoBox";
import PostForm from "./PostForm";
import Dialog from "/imports/ui/client/components/Dialog";
import Medium from "/imports/ui/client/components/Medium";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import Err404 from "/imports/ui/client/components/Err404";
import Content from "/imports/ui/client/components/Content";
import FAB from "/imports/ui/client/components/FAB";
import AlbumSelector from "/imports/ui/client/components/Album/AlbumSelector";
import AvatarCropper from "/imports/ui/client/components/Avatar/AvatarCropper";
import TagTree from "/imports/ui/client/components/Tag/TagTree";
import InlineTopic from "/imports/ui/client/components/Chat/InlineTopic";
import ReportForm from "/imports/ui/client/components/Report/ReportForm";

export default React.createClass({
  getInitialState() {
    return {
      showAlbumSelector: false,
      avatarCropper: false,
      showForm: false,
      showReportForm: false
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
  showAlbumSelector(offset) {
    this.setState({
      showAlbumSelector: true,
      albumSelectorOffset: offset
    });
  },
  hideAlbumSelector() {
    this.setState({ showAlbumSelector: false });
  },
  showAvatarCropper() {
    this.setState({ avatarCropper: true });
  },
  hideAvatarCropper() {
    this.setState({ avatarCropper: false });
  },
  like() {
    const post = this.props.post;
    Meteor.call("likePost", post._id, ! _.includes(post.likes, this.props.currentUser._id));
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
    this.setState({ showForm: false });
  },
  showReportForm() {
    this.setState({ showReportForm: true });
  },
  hideReportForm() {
    this.setState({ showReportForm: false });
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Edit Post"
        formId={"form" + this.props.post._id}
        open={true}
        onClose={this.hideForm}
      >
        <PostForm
          id={"form" + this.props.post._id}
          post={this.props.post}
          onClose={this.hideForm}
        />
      </Dialog>;
    }
  },
  renderReportForm() {
    if (this.state.showReportForm) {
      return <Dialog
        title="Report Post"
        formId={"formReport" + this.props.post._id}
        open={true}
        onClose={this.hideReportForm}
      >
        <ReportForm
          id={"formReport" + this.props.post._id}
          item={this.props.post}
          itemType="post"
          onClose={this.hideReportForm}
        />
      </Dialog>;
    }
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
  renderAlbumSelector() {
    if (this.state.showAlbumSelector) {
      return <AlbumSelector
        postId={this.props.post._id}
        offset={this.state.albumSelectorOffset}
        onClose={this.hideAlbumSelector}
      />;
    }
  },
  renderAvatarCropper() {
    if (this.state.avatarCropper) {
      const src = getMediaUrlMD5(this.props.post.medium.md5);
      return <Content>
        <AvatarCropper src={src} cancelAction={this.hideAvatarCropper} />
      </Content>;
    }
  },
  renderFab(isOwner) {
    if (isOwner) {
      return <FAB iconName="edit" onTouchTap={this.showForm} />;
    } else if (this.props.currentUser && this.props.post.medium) {
      const liked = _.includes(this.props.post.likes, this.props.currentUser._id);
      return <FAB iconName={liked ? "favorite" : "favorite_border"} onTouchTap={this.like} />;
    }
  },
  render() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    if (! this.props.post) {
      return <Err404 />;
    }

    const isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.post.owner._id;

    return <article className="post contentLayout">
      <figure className="content">
        <Medium
          medium={this.props.post.medium}
          safety={this.props.post.safety}
        />
      </figure>
      <PostInfoBox
        post={this.props.post}
        currentUser={this.props.currentUser}
        isCropping={this.state.avatarCropper}
        showReportForm={this.showReportForm}
        showAlbumSelector={this.showAlbumSelector}
        showAvatarCropper={this.showAvatarCropper}
        hideAvatarCropper={this.hideAvatarCropper}
      />
      {this.renderAlbumSelector()}
      {this.renderAvatarCropper()}
      {this.renderTags()}
      <section className="comments content">
        <InlineTopic
          topicId={this.props.post.topic._id}
          currentUser={this.props.currentUser}
        />
      </section>
      {this.renderLikes()}
      {this.renderFab(isOwner)}
      {this.renderForm()}
      {this.renderReportForm()}
    </article>;
  }
});

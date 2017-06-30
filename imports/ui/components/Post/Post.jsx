import _ from "lodash";
import React from "react";

import { getMediaUrlMD5, getMediaUrlPost } from "/imports/api/media/urls";
import metaBuilder from "/imports/ui/utils/metaBuilder";
import setPattern from "/imports/ui/utils/setPattern";
import PostLikes from "./PostLikes";
import PostInfoBox from "./PostInfoBox";
import PostForm from "./PostForm";
import Dialog from "/imports/ui/components/Dialog";
import Medium from "/imports/ui/components/Medium";
import LoadingSpinner from "/imports/ui/components/Spinner/LoadingSpinner";
import Err404 from "/imports/ui/components/Err404";
import Content from "/imports/ui/components/Content";
import FAB from "/imports/ui/components/FAB";
import AvatarCropper from "/imports/ui/components/Avatar/AvatarCropper";
import InlineTopic from "/imports/ui/components/Chat/InlineTopic";
import ReportForm from "/imports/ui/components/Report/ReportForm";

export default React.createClass({
  getInitialState() {
    return {
      avatarCropper: false,
      showForm: false,
      showReportForm: false
    };
  },
  componentWillMount() {
    if (this.props.post) {
      const post = this.props.post;
      metaBuilder({
        title: post.name,
        description: post.description,
        image: (size) => {
          return getMediaUrlPost(post._id, size);
        }
      });

      setPattern(this.props.post.name, this.props.post.bgColor || this.props.post.complement);
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.post) {
      setPattern(nextProps.post.name, nextProps.post.bgColor || nextProps.post.complement);
    }
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
          itemType="image"
          onClose={this.hideReportForm}
        />
      </Dialog>;
    }
  },
  renderLikes() {
    if (this.props.post.likes && this.props.post.likes.length) {
      return <PostLikes id={"likes" + this.props.post._id} likes={this.props.post.likes} />;
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
      return <FAB iconName="edit" onClick={this.showForm} />;
    } else if (this.props.currentUser && this.props.post.medium) {
      const liked = _.includes(this.props.post.likes, this.props.currentUser._id);
      return <FAB iconName={liked ? "favorite" : "favorite_border"} onClick={this.like} />;
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
          spoilered={_.has(this.props.spoilered, this.props.post._id)}
          reason={_.get(this.props.spoilered, this.props.post._id)}
          loop={this.props.post.loop}
        />
      </figure>
      <PostInfoBox
        post={this.props.post}
        currentUser={this.props.currentUser}
        isCropping={this.state.avatarCropper}
        showReportForm={this.showReportForm}
        showAvatarCropper={this.showAvatarCropper}
        hideAvatarCropper={this.hideAvatarCropper}
      />
      {this.renderAvatarCropper()}
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

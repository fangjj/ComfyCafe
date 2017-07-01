import _ from "lodash";
import React from "react";
import NoSSR from "react-no-ssr";

import safetyLabels from "/imports/api/common/safetyLabels";
import PostMoreMenu from "./PostMoreMenu";
import OriginalityIcon from "/imports/ui/components/Daikon/OriginalityIcon";
import VisibilityLink from "/imports/ui/components/VisibilityLink";
import ThumbnailProxy from "/imports/ui/components/ThumbnailProxy";
import Avatar from "/imports/ui/components/Avatar/Avatar";

export default React.createClass({
  shouldComponentUpdate(nextProps) {
    const should = (
      _.get(nextProps.currentUser, "_id") !== _.get(this.props.currentUser, "_id")
      || nextProps.spoilered !== this.props.spoilered
      || JSON.stringify(nextProps.reason) !== JSON.stringify(this.props.reason)
      || (
        _.get(nextProps.currentUser, "bookmarks") !== _.get(this.props.currentUser, "bookmarks")
        && _.includes(
          _.xor(
            _.get(nextProps.currentUser, "bookmarks"),
            _.get(this.props.currentUser, "bookmarks")
          ),
          nextProps.post._id
        )
      )
      || JSON.stringify(nextProps.post) !== JSON.stringify(this.props.post)
    );
    return should;
  },
  buildTitle() {
    const post = this.props.post;
    return `(${safetyLabels[post.safety]}) ${_.get(post, "tags.text", "")}`;
  },
  renderMoreMenu() {
    const isOwner = _.get(this.props.currentUser, "_id") === this.props.post.owner._id;
    if (isOwner) {
      return <NoSSR>
        <PostMoreMenu post={this.props.post} currentUser={this.props.currentUser} />
      </NoSSR>;
    } else if (this.props.currentUser) {
      return;
    }
  },
  renderStar() {
    const iconMap = {
      original: "star",
      derivative: "device_hub",
      repost: "repeat"
    };
    return <div className="star">
      <OriginalityIcon originality={this.props.post.originality} />
    </div>;
  },
  render() {
    if (! this.props.post || _.isEmpty(this.props.post)) {
      return null;
    }

    const postUrl = FlowRouter.path("post", {
      username: this.props.post.owner.username,
      postName: this.props.post.name
    });
    const owner = this.props.post.owner;
    const ownerUrl = FlowRouter.path("profile", {username: owner.username});
    return <li className={"postPreview " + this.props.post.visibility} title={this.buildTitle()}>
      <a href={ownerUrl} className="avatarLink">
        <Avatar size="icon" user={owner} />
        {this.renderStar()}
      </a>
      <VisibilityLink href={postUrl} published={this.props.post.published}>
        <ThumbnailProxy
          medium={this.props.post.medium}
          size="list"
          safety={this.props.post.safety}
          spoilered={this.props.spoilered}
          reason={this.props.reason}
        />
        <div className="label">
          {this.props.post.name}
        </div>
      </VisibilityLink>
      {this.renderMoreMenu()}
    </li>;
  }
});

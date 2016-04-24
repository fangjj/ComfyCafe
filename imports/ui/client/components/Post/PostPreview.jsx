import _ from "lodash";
import React from "react";

import PostMoreMenu from "./PostMoreMenu";
import PostBookmarkButton from "./PostBookmarkButton";
import OriginalityIcon from "/imports/ui/client/components/Daikon/OriginalityIcon";
import VisibilityLink from "/imports/ui/client/components/VisibilityLink";
import Thumbnail from "/imports/ui/client/components/Thumbnail";
import Avatar from "/imports/ui/client/components/Avatar/Avatar";

export default React.createClass({
  shouldComponentUpdate(nextProps) {
    const should = (
      _.get(nextProps.currentUser, "_id") !== _.get(this.props.currentUser, "_id")
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
    console.log(should);
    return should;
  },
  renderMoreMenu() {
    const isOwner = _.get(this.props.currentUser, "_id") === this.props.post.owner._id;
    if (isOwner) {
      return <PostMoreMenu post={this.props.post} currentUser={this.props.currentUser} />;
    } else if (this.props.currentUser) {
      return <PostBookmarkButton post={this.props.post} currentUser={this.props.currentUser} />;
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
    const postUrl = FlowRouter.path("post", {
      username: this.props.post.owner.username,
      postName: this.props.post.name
    });
    const owner = this.props.post.owner;
    const ownerUrl = FlowRouter.path("profile", {username: owner.username});
    return <li className={"postPreview " + this.props.post.visibility}>
      <a href={ownerUrl} className="avatarLink">
        <Avatar size="icon" user={owner} />
        {this.renderStar()}
      </a>
      <VisibilityLink href={postUrl} visibility={this.props.post.visibility}>
        <Thumbnail
          medium={this.props.post.medium}
          size="list"
          filter={this.props.post.pretentiousFilter}
        />
        <div className="label">
          {this.props.post.name}
        </div>
      </VisibilityLink>
      {this.renderMoreMenu()}
    </li>;
  }
});

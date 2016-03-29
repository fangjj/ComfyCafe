import React from "react";

import {
  FontIcon
} from "material-ui";

PostPreview = React.createClass({
  renderMoreMenu() {
    const isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.post.owner._id;
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
          pretentiousFilter={this.props.post.pretentiousFilter}
        />
        <div className="label">
          {this.props.post.name}
        </div>
      </VisibilityLink>
      {this.renderMoreMenu()}
    </li>;
  }
});

import React from "react";

import BlogMoreMenu from "./BlogMoreMenu";
import TextBody from "/imports/ui/client/components/TextBody";
import Moment from "/imports/ui/client/components/Moment";
import VisibilityLink from "/imports/ui/client/components/VisibilityLink";
import UserLink from "/imports/ui/client/components/User/UserLink";
import Avatar from "/imports/ui/client/components/Avatar/Avatar";

export default React.createClass({
  renderTitle(post) {
    if (post.name && post.name.toLowerCase() !== "untitled") {
      return <h2>{post.name}</h2>;
    }
  },
  renderMoreMenu() {
    const isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.post.owner._id;
    if (isOwner) {
      return <BlogMoreMenu post={this.props.post} currentUser={this.props.currentUser} />;
    }
  },
  render() {
    const post = this.props.post;

    const owner = post.owner;
    const ownerUrl = FlowRouter.path("profile", { username: owner.username });

    const permaLink = FlowRouter.path("blogPost", { username: owner.username, slug: post.slug });

    return <li className="blogPost">
      <article className="flexLayout">
        <div className="leftSide">
          <a href={ownerUrl}>
            <Avatar size="small" user={owner} />
          </a>
        </div>
        <div className="rightSide">
          {this.renderTitle(post)}
          <div className="top">
            <div className="info">
              by <UserLink user={owner} /> <Moment time={post.createdAt} />
              &nbsp;<VisibilityLink
                href={permaLink}
                visibility={post.visibility}
              >(link)</VisibilityLink>
            </div>
            {this.renderMoreMenu()}
          </div>
          <TextBody text={post.body} className="body" />
        </div>
      </article>
    </li>;
  }
});

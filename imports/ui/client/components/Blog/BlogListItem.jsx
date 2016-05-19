import _ from "lodash";
import React from "react";

import BlogMoreMenu from "./BlogMoreMenu";
import TextBody from "/imports/ui/client/components/TextBody";
import Moment from "/imports/ui/client/components/Moment";
import VisibilityLink from "/imports/ui/client/components/VisibilityLink";
import UserLink from "/imports/ui/client/components/User/UserLink";
import Avatar from "/imports/ui/client/components/Avatar/Avatar";

export default React.createClass({
  renderTitle(post, permaLink) {
    if (post.name && post.name.toLowerCase() !== "untitled") {
      return <h2><a href={permaLink}>{post.name}</a></h2>;
    }
  },
  renderEdited(post, wasEdited) {
    if (wasEdited) {
      return <span> (edited <Moment time={post.updatedAt} />)</span>;
    }
  },
  renderMoreMenu() {
    const isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.post.owner._id;
    if (isOwner) {
      return <BlogMoreMenu
        post={this.props.post}
        solo={this.props.solo}
        currentUser={this.props.currentUser}
      />;
    }
  },
  render() {
    const post = this.props.post;

    const owner = post.owner;
    const ownerUrl = FlowRouter.path("profile", { username: owner.username });
    const wasEdited = ! _.isEqual(post.createdAt, post.updatedAt);
    const permaLink = FlowRouter.path("blogPost", { username: owner.username, slug: post.slug });

    return <li className="blogPost">
      <article className="flexLayout">
        <div className="leftSide">
          <a href={ownerUrl}>
            <Avatar size="small" user={owner} />
          </a>
        </div>
        <div className="rightSide">
          {this.renderTitle(post, permaLink)}
          <div className="top">
            <div className="info">
              by <UserLink user={owner} /> <Moment time={post.createdAt} />
              {this.renderEdited(post, wasEdited)}
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

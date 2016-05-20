import _ from "lodash";
import React from "react";

import { isMod } from "/imports/api/common/persimmons";
import BlogMoreMenu from "/imports/ui/client/components/Blog/BlogMoreMenu";
import TextBody from "/imports/ui/client/components/TextBody";
import Moment from "/imports/ui/client/components/Moment";
import VisibilityLink from "/imports/ui/client/components/VisibilityLink";
import UserLink from "/imports/ui/client/components/User/UserLink";
import Avatar from "/imports/ui/client/components/Avatar/Avatar";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import Toolbar from "/imports/ui/client/components/Toolbar";
import ModButton from "/imports/ui/client/components/ModButton";
import ReportButton from "/imports/ui/client/components/Button/ReportButton";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
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
  renderMoreMenu(post) {
    if (! this.context.currentUser) {
      return;
    }

    const isOwner = this.context.currentUser._id === post.owner._id;
    if (isOwner) {
      return <BlogMoreMenu
        post={post}
        solo={this.props.solo}
        currentUser={this.context.currentUser}
      />;
    } else {
      if (isMod(this.context.currentUser._id)) {
        return <ModButton item={post} itemType="blog" />;
      } else {
        return <ReportButton icon={true} />;
      }
    }
  },
  render() {
    const post = this.props.post;

    const owner = post.owner;
    const ownerUrl = FlowRouter.path("profile", { username: owner.username });
    const isOwner = this.context.currentUser && owner._id === this.context.currentUser._id;
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
            {this.renderMoreMenu(post)}
          </div>
          <TextBody text={post.body} className="body" />
          <Toolbar>
            <a href={permaLink}>
              <Icon title="Comment">comment</Icon> {post.commentCount}
            </a>
            {post.visibility === "public" || isOwner
              ? <span><Icon title="Reblog">repeat</Icon> {post.reblogCount}</span>
              : null}
          </Toolbar>
        </div>
      </article>
    </li>;
  }
});

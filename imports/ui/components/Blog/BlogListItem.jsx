import _ from "lodash";
import React from "react";

import { isMod } from "/imports/api/common/persimmons";
import BlogMoreMenu from "/imports/ui/components/Blog/BlogMoreMenu";
import TextBody from "/imports/ui/components/TextBody";
import Moment from "/imports/ui/components/Moment";
import VisibilityLink from "/imports/ui/components/VisibilityLink";
import UserLink from "/imports/ui/components/User/UserLink";
import Avatar from "/imports/ui/components/Avatar/Avatar";
import Icon from "/imports/ui/components/Daikon/Icon";
import Toolbar from "/imports/ui/components/Toolbar";
import ModButton from "/imports/ui/components/ModButton";
import ReportButton from "/imports/ui/components/Button/ReportButton";
import DialogForm from "/imports/ui/components/DialogForm";
import ReportForm from "/imports/ui/components/Report/ReportForm";
import BlogForm from "/imports/ui/components/Blog/BlogForm";
import Reblog from "/imports/ui/components/Blog/Reblog";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    return { showReblogForm: false, showReportForm: false };
  },
  showReblogForm() {
    this.setState({ showReblogForm: true });
  },
  hideReblogForm() {
    this.setState({ showReblogForm: false });
  },
  renderReblogForm() {
    if (this.state.showReblogForm) {
      return <DialogForm
        title="Reblog"
        id={"formReblog" + this.props.post._id}
        onClose={this.hideReblogForm}
        form={<BlogForm reblogOf={this.props.post} />}
      />;
    }
  },
  showReportForm() {
    this.setState({ showReportForm: true });
  },
  hideReportForm() {
    this.setState({ showReportForm: false });
  },
  renderReportForm() {
    if (this.state.showReportForm) {
      return <DialogForm
        title="Report Blog Post"
        id={"formReport" + this.props.post._id}
        onClose={this.hideReportForm}
        form={<ReportForm
          item={this.props.post}
          itemType="blog"
        />}
      />;
    }
  },
  renderTitle(post, permaLink) {
    if (! this.props.isChild && post.name && post.name.toLowerCase() !== "untitled") {
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
        return <ReportButton icon={true} onClick={this.showReportForm} />;
      }
    }
  },
  renderToolbar(post, permaLink) {
    if (! this.props.isChild) {
      return <Toolbar>
        <a href={permaLink}><Icon title="Comment">comment</Icon></a>
        {this.renderReblogButton(post)}
      </Toolbar>;
    }
  },
  renderReblogButton(post) {
    if (post.visibility === "public" || isOwner) {
      return <Icon title="Reblog" onClick={this.showReblogForm}>repeat</Icon>;
    }
  },
  render() {
    const post = this.props.post;

    const owner = post.owner;
    const ownerUrl = FlowRouter.path("profile", { username: owner.username });
    const isOwner = this.context.currentUser && owner._id === this.context.currentUser._id;
    const wasEdited = ! _.isEqual(post.createdAt, post.updatedAt);
    const permaLink = FlowRouter.path("blogPost", { username: owner.username, slug: post.slug });

    return <li className={"blogPost" + (post.reblogOf ? " isReblog" : "")}>
      <article className="flexLayout">
        <div className="leftSide">
          <a href={ownerUrl}>
            <Avatar size={! this.props.isChild ? "small" : "icon"} user={owner} />
          </a>
        </div>
        <div className="rightSide">
          {this.renderTitle(post, permaLink)}
          <div className="top">
            <div className="info">
              {post.reblogOf ? "reblogged " : null}
              by <UserLink user={owner} /> <Moment time={post.createdAt} />
              {this.renderEdited(post, wasEdited)}
              &nbsp;<VisibilityLink
                href={permaLink}
                visibility={post.visibility}
              >(link)</VisibilityLink>
            </div>
            {this.renderMoreMenu(post)}
          </div>
          <Reblog reblogOf={post.reblogOf} reblogData={post.reblogData || this.props.reblogData} />
          <TextBody text={post.body} className="body" />
          {this.renderToolbar(post, permaLink)}
        </div>
      </article>
      {this.renderReblogForm()}
      {this.renderReportForm()}
    </li>;
  }
});

import React from "react";

const BlogListItem = React.createClass({
  renderMoreMenu() {
    var isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.post.owner._id;
    if (isOwner) {
      return <BlogMoreMenu post={this.props.post} currentUser={this.props.currentUser} />;
    }
  },
  render() {
    const post = this.props.post;

    const owner = post.owner;
    const ownerUrl = FlowRouter.path("profile", {username: owner.username});

    const permaLink = FlowRouter.path("blogPost", {postId: post._id});

    return <li className="blogPost">
      <article className="flexLayout">
        <div className="leftSIde">
          <a href={ownerUrl}>
            <Avatar size="small" user={owner} />
          </a>
        </div>
        <div className="rightSide">
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

export default BlogListItem;

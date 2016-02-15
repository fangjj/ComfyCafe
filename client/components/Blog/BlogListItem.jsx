BlogListItem = React.createClass({
  renderMoreMenu() {
    var isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.post.owner._id;
    if (isOwner) {
      return <BlogMoreMenu post={this.props.post} currentUser={this.props.currentUser} />;
    }
  },
  render() {
    var post = this.props.post;

    var owner = post.owner;
    var ownerUrl = FlowRouter.path("profile", {username: owner.username});

    var isoDate = moment(post.createdAt).toISOString();
    var prettyDate = moment(post.createdAt).fromNow();

    var permaLink = FlowRouter.path("blogPostPerma", {postId: post._id});

    return <li className="blogPost">
      <article className="content">
        <div className="leftSIde">
          <a href={ownerUrl}>
            <AvatarComponent class="small" id={owner._id} profile={owner.profile} title={owner.username} />
          </a>
        </div>
        <div className="rightSide">
          <div className="top">
            <div className="info">
              by <a href={ownerUrl}>{owner.username}</a> <time dateTime={isoDate}>{prettyDate}</time>
              &nbsp;<a href={permaLink}>(link)</a>
            </div>
            {this.renderMoreMenu()}
          </div>
          <TextBody text={this.props.post.body} className="body" />
        </div>
      </article>
    </li>;
  }
});

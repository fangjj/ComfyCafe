PostPreview = React.createClass({
  renderMoreMenu() {
    const isOwner = this.props.currentUser
      && this.props.currentUser._id === this.props.post.owner._id;
    if (isOwner) {
      return <PostMoreMenu post={this.props.post} currentUser={this.props.currentUser} />;
    }
  },
  render() {
    const postUrl = FlowRouter.path("post", {
      username: this.props.post.owner.username,
      postName: this.props.post.name
    });
    const owner = this.props.post.owner;
    const ownerUrl = FlowRouter.path("profile", {username: owner.username});
    return <li className={"postPreview " + this.props.post.visibility}>
      {this.renderMoreMenu()}
      <a href={ownerUrl} className="avatarLink">
        <AvatarComponent size="icon" user={owner} />
      </a>
      <a href={postUrl}>
        <ThumbnailComponent medium={this.props.post.medium} size="list" />
        <div className="label">
          {this.props.post.name}
        </div>
      </a>
    </li>;
  }
});
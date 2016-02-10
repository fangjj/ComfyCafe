PostPreviewComponent = React.createClass({
  render() {
    var postUrl = FlowRouter.path("post", {postId: this.props.post._id});
    return <li>
      <a href={postUrl}>
        <ThumbnailComponent medium={this.props.post.medium} size="list" />
      </a>
    </li>;
  }
});

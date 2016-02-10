PostPreviewComponent = React.createClass({
  render() {
    var postUrl = FlowRouter.path("post", {
      username: this.props.post.uploader.username,
      postName: this.props.post.name
    });
    return <li>
      <a href={postUrl}>
        <ThumbnailComponent medium={this.props.post.medium} size="list" />
      </a>
    </li>;
  }
});

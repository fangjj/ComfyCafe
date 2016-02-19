PostPreviewComponent = React.createClass({
  render() {
    var postUrl = FlowRouter.path("post", {
      username: this.props.post.owner.username,
      postName: this.props.post.name
    });
    return <li>
      <a href={postUrl}>
        <ThumbnailComponent medium={this.props.post.medium} size="list" />
        <div className="label">
          {this.props.post.name}
        </div>
      </a>
    </li>;
  }
});

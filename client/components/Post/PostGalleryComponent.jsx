PostGalleryComponent = React.createClass({
  renderPosts() {
    if (this.props.posts.length) {
      return this.props.posts.map((post) => {
        return <PostPreviewComponent post={post} key={post._id} />;
      });
    }
  },
  render() {
    var posts = this.props.posts;
    return <div className="content">
      <ul className="gallery">
        {this.renderPosts()}
      </ul>
    </div>;
  }
});

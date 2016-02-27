PostBrowseComponent = React.createClass({
  renderInner() {
    if (this.props.posts.length) {
      return <PostGalleryComponent posts={this.props.posts} />;
    } else {
      return <Uhoh>
        You haven't uploaded anything!
        <div className="smaller">
          To upload a file, either press the button in the bottom right corner, or just drop a file anywhere.
        </div>
      </Uhoh>;
    }
  },
  render() {
    return <div>
      {this.renderInner()}
      <UploadFAB />
    </div>;
  }
});
PostBrowseComponent = React.createClass({
  renderInner() {
    if (this.props.posts.length) {
      return <PostGallery
        posts={this.props.posts}
        currentUser={this.props.currentUser}
        onFilter={this.props.onFilter}
      />;
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

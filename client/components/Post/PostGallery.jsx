let {
  TextField,
  Checkbox
} = mui;

PostGallery = React.createClass({
  getInitialState() {
    return {
      originalOnly: false
    }
  },
  handleOriginalOnly(event) {
    const originalOnly = event.target.checked;
    this.setState({originalOnly: originalOnly});
    this.props.onFilter((filter) => {
      return {
        original: originalOnly
      };
    });
  },
  renderPosts() {
    if (this.props.posts.length) {
      return this.props.posts.map((post) => {
        return <PostPreviewComponent
          post={post}
          currentUser={this.props.currentUser}
          key={post._id}
        />;
      });
    }
  },
  render() {
    const posts = this.props.posts;
    return <div className="postGallery content">
      <div className="filter">
        <div>
          <Checkbox
            defaultChecked={this.state.originalOnly}
            label="Original only"
            labelStyle={{fontSize: "20px"}}
            onCheck={this.handleOriginalOnly}
          />
        </div>
        <div>
          <TextField
            hintText="Search"
          />
        </div>
      </div>
      <ul className="gallery">
        {this.renderPosts()}
      </ul>
    </div>;
  }
});

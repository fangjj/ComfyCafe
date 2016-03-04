let {
  TextField,
  Checkbox
} = mui;

PostGallery = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      originalOnly: false,
      tagStr: ""
    }
  },
  getMeteorData() {
    let doc = this.props.generateDoc.bind(this)();

    if (this.state.originalOnly) {
      doc.original = { $ne: false };
    }

    if (this.state.tagStr) {
      const parsed = queryTags(this.state.tagStr, Meteor.userId());
      _.each(parsed, (value, key) => {
        if (_.has(doc, key)) {
          console.error("PANIC: key " + key + " already present in doc.");
        }
        doc[key] = value;
      });
    }

    //prettyPrint(doc);

    let handle = Meteor.subscribe(this.props.subName, this.props.subData);
    return {
      loading: ! handle.ready(),
      posts: Posts.find(
  			doc,
  			{ sort: { createdAt: -1, name: 1 } }
  		).fetch(),
      currentUser: Meteor.user()
    };
  },
  handleOriginalOnly(event) {
    this.setState({originalOnly: event.target.checked});
  },
  handleSearch(event) {
    this.setState({tagStr: event.target.value})
  },
  renderPosts() {
    if (this.data.posts.length) {
      return this.data.posts.map((post) => {
        return <PostPreview
          post={post}
          currentUser={this.data.currentUser}
          key={post._id}
        />;
      });
    } else {
      return this.props.ifEmpty.bind(this)();
    }
  },
  renderFab() {
    if (this.data.currentUser) {
      if (this.props.fabCond) {
        if (this.props.fabCond.bind(this)()) {
          return <UploadFAB />;
        }
      } else if (! this.props.noFab) {
        return <UploadFAB />;
      }
    }
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    if (this.props.requireAuth && ! this.data.currentUser) {
      return <PowerlessComponent />;
    }

    const posts = this.data.posts;
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
            onChange={this.handleSearch}
          />
        </div>
      </div>
      <ul className="gallery">
        {this.renderPosts()}
      </ul>
      {this.renderFab()}
    </div>;
  }
});

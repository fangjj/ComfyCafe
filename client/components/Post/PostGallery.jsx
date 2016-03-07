let {
  TextField,
  Checkbox,
  FontIcon
} = mui;

PostGallery = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      originalOnly: false,
      tagStr: "",
      filter: "sfw"
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

    if (this.state.filter) {
      if (this.state.filter === "your") {
        doc["owner._id"] = Meteor.userId();
      }
    }

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
  handleFilter(event, index, value) {
    this.setState({filter: value});
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
      if (muxOr([
        this.state.originalOnly,
        this.state.tagStr,
        this.state.filter
      ])) {
        return <InlineUhoh>
          No results.
        </InlineUhoh>;
      }
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
        <div style={{flexGrow: 2}}>
          <TextField
            hintText="Search"
            fullWidth={true}
            onChange={this.handleSearch}
          />
        </div>
        <div style={{flexGrow: 1}}>
          <PostFilters
            filter={this.state.filter}
            onChange={this.handleFilter}
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

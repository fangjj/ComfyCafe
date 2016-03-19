let {
  TextField,
  Checkbox,
  FontIcon
} = mui;

const defaultState = {
  originalOnly: false,
  tagStr: "",
  filter: "sfw"
};

PostGallery = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      originalOnly: (getQueryParam("originalOnly") === "true") || defaultState.originalOnly,
      tagStr: getQueryParam("query") || defaultState.tagStr,
      filter: getQueryParam("filter") || defaultState.filter
    }
  },
  getMeteorData() {
    let doc = this.props.generateDoc.bind(this)();

    let queuedParams = [];

    if (this.state.originalOnly) {
      queuedParams.push({originalOnly: this.state.originalOnly});
      doc.original = { $ne: false };
    } else {
      queuedParams.push({originalOnly: undefined});
    }

    if (this.state.tagStr) {
      if (this.state.tagStr !== defaultState.tagStr) {
        queuedParams.push({query: this.state.tagStr});
      } else {
        queuedParams.push({query: undefined});
      }
      const parsed = tagQuery(this.state.tagStr);
      _.each(parsed, (value, key) => {
        if (_.has(doc, key)) {
          prettyPrint(value);
          if (_.includes(["$and", "$or", "$nor"], key)) {
            doc[key].push.apply(doc[key], value);
          } else {
            console.error("PANIC: key " + key + " already present in doc.");
          }
        } else {
          doc[key] = value;
        }
      });
    }

    if (this.state.filter) {
      if (this.state.filter !== defaultState.filter) {
        queuedParams.push({filter: this.state.filter});
      } else {
        queuedParams.push({filter: undefined});
      }
      if (this.state.filter === "your") {
        doc["owner._id"] = Meteor.userId();
      }
    }

    pushState(setQueryParams(queuedParams));

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
      return <LoadingSpinner />;
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
            defaultValue={this.state.tagStr}
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

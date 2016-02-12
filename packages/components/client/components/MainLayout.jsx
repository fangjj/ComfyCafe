MainLayout = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext(){
    return {
      muiTheme: mui.Styles.ThemeManager.getMuiTheme(mui.Styles.DarkRawTheme)
    }
  },
  getInitialState() {
    return {
      isUploading: false,
      progress: 0,
      postId: undefined
    };
  },
  componentDidMount() {
    var self = this;
    media.resumable.assignDrop(document.querySelector("html"));
    media.resumable.on("fileAdded", function (file) {
      // The file's entrypoint; used to route storage actions.
      var source = file.file.source;
      if (! source) {
        if (file.container) {
          source = file.container.className;
        } else {
          // file.container is undefined in Firefox for some reason...
          // but since there are only two cases, we can just go to default.
          source = "default";
        }
      }

      if (source === "avatar") {
        // This is definitely an avatar!
        avatarUpload(self, file);
      } else {
        // This is... everything else!
        mediaUpload(self, file, function (id) {
          self.setState({mediumId: id});
        });
      }
    });
    media.resumable.on("progress", function () {
      self.setState({progress: media.resumable.progress() * 100});
    });
  },
  destroyPostForm() {
    this.setState({mediumId: undefined});
  },
  renderPostForm() {
    if (this.state.mediumId) {
      return <PostFormComponent
        mediumId={this.state.mediumId}
        destroy={this.destroyPostForm}
        open={true}
      />;
    }
  },
  render() {
    var progressBar;
    if (this.state.isUploading) {
      progressBar = <div className="progress bottom">
        <div className="determinate" style={{width: this.state.progress + "%"}}></div>
      </div>;
    }
    return <div>
      <header>
        <TopBarComponent />
      </header>
      <main>
        {this.props.main}
      </main>
      {this.props.fab}
      {this.renderPostForm()}
      <footer>
        © 2016 Pepperoni Pizza Inc.
      </footer>
      {progressBar}
    </div>;
  }
});

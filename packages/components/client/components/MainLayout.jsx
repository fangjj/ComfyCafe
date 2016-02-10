MainLayout = React.createClass({
  getInitialState() {
    return {
      isUploading: false,
      progress: 0
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
        mediaUpload(self, file);
      }
    });
    media.resumable.on("progress", function () {
      self.setState({progress: media.resumable.progress() * 100});
    });
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
      <footer>
        © 2016 Pepperoni Pizza Inc.
      </footer>
      {progressBar}
    </div>;
  }
});

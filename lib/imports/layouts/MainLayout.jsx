import React from "react";
import mui from "material-ui";

MainLayout = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext() {
    var theme = mui.Styles.ThemeManager.getMuiTheme(mui.Styles.DarkRawTheme);
    theme = mui.Styles.ThemeManager.modifyRawThemeFontFamily(theme, "Slabo 27px");
    theme = mui.Styles.ThemeManager.modifyRawThemePalette(theme, {
      primary1Color: "#009688",
      //accent1Color: "#880E4F",
      accent1Color: "#64FFDA",
      textColor: "#EEF4EE",
      alternateTextColor: "#EEF4EE"
    });
    return {
      muiTheme: theme
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
  freeMedium() {
    if (this.state.mediumId) {
      Meteor.call("freeMedium", this.state.mediumId);
    }
    this.destroyPostForm();
  },
  renderPostForm() {
    if (this.state.mediumId) {
      return <PostForm
        mediumId={this.state.mediumId}
        destroy={this.destroyPostForm}
        open={true}
        handleClose={this.freeMedium}
      />;
    }
  },
  renderFooter() {
    if (! this.props.dense) {
      return <footer>
        © 2016 ComfySoft LLC
      </footer>;
    }
  },
  render() {
    var progressBar;
    if (this.state.isUploading) {
      progressBar = <div className="progress bottom">
        <div className="determinate" style={{width: this.state.progress + "%"}}></div>
      </div>;
    }
    return <div onDrop={this.test}>
      <header>
        <TopBarComponent />
      </header>
      <main>
        {this.props.main}
      </main>
      {this.renderPostForm()}
      {this.renderFooter()}
      {progressBar}
    </div>;
  }
});

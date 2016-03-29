import _ from "lodash";
import React from "react";

import PseudoBody from "/lib/imports/components/PseudoBody";
import TopBarComponent from "/lib/imports/components/TopBar/TopBarComponent";
import PostForm from "/lib/imports/components/Post/PostForm";

import MuiThemeProvider from "material-ui/lib/MuiThemeProvider";
import getMuiTheme from "material-ui/lib/styles/getMuiTheme";
import {
  cyan700,
  grey600,
  pinkA100, pinkA200, pinkA400,
  fullWhite
} from "material-ui/lib/styles/colors";
import ColorManipulator from "material-ui/lib/utils/color-manipulator";

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#009688",
    //accent1Color: "#880E4F",
    accent1Color: "#64FFDA",
    textColor: "#EEF4EE",
    alternateTextColor: "#EEF4EE",

    // copied from darkBaseTheme
    // https://github.com/callemall/material-ui/blob/master/src/styles/baseThemes/darkBaseTheme.js
    primary2Color: cyan700,
    primary3Color: grey600,
    accent2Color: pinkA400,
    accent3Color: pinkA100,
    canvasColor: "#303030",
    borderColor: ColorManipulator.fade(fullWhite, 0.3),
    disabledColor: ColorManipulator.fade(fullWhite, 0.3),
    pickerHeaderColor: ColorManipulator.fade(fullWhite, 0.12),
    clockCircleColor: ColorManipulator.fade(fullWhite, 0.12)
  },
  fontFamily: "Slabo 27px"
});

const MainLayout = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      isUploading: false,
      progress: 0,
      postId: undefined,
      seed: undefined
    };
  },
  getMeteorData() {
    return {
      currentUser: Meteor.user()
    };
  },
  componentWillMount() {
    const seed = _.get(this, "data.currentUser.settings.patternSeed");
    if (seed) {
      this.setState({
        seed: seed
      });
    }

    if (Meteor.isServer) {
      const ua = FlowRouter.current()._serverRequest.headers["user-agent"];
      muiTheme.userAgent = ua;
    }
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
  setPattern(seed) {
    this.setState({
      seed: seed
    });
  },
  setColor(color) {
    this.setState({
      color: color
    });
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
  renderProgress() {
    if (this.state.isUploading) {
      return <div className="progress bottom">
        <div className="determinate" style={{width: this.state.progress + "%"}}></div>
      </div>;
    }
  },
  render() {
    const main = React.cloneElement(this.props.main, { setPattern: this.setPattern });
    return <MuiThemeProvider muiTheme={muiTheme}>
      <div onDrop={this.test}>
        <PseudoBody
          seed={this.state.seed}
          setColor={this.setColor}
        />
        <header>
          <TopBarComponent color={this.state.color} />
        </header>
        <main>
          {main}
        </main>
        {this.renderPostForm()}
        {this.renderFooter()}
        {this.renderProgress()}
      </div>
    </MuiThemeProvider>;
  }
});

export default MainLayout;

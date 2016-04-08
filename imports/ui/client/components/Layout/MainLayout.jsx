import _ from "lodash";
import React from "react";

import "/imports/api/media/methods";
import media from "/imports/api/media/collection";
import mediaUpload from "/imports/api/media/handlers/media";
import avatarUpload from "/imports/api/media/handlers/avatar";

import setPattern from "/imports/ui/client/utils/setPattern";
import UploadQueue from "/imports/ui/client/components/UploadQueue";
import PseudoBodyContainer from "/imports/ui/client/components/PseudoBodyContainer";
import TopBarComponent from "/imports/ui/client/components/TopBar/TopBarComponent";
import PostForm from "/imports/ui/client/components/Post/PostForm";

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
  uploads: {},
  getInitialState() {
    return {
      updateQueue: _.uniqueId(),
      postId: undefined,
      seed: undefined
    };
  },
  getMeteorData() {
    const handle = Meteor.subscribe("mediaQueue", Meteor.userId());
    return {
      loading: ! handle.ready(),
      preQueue: _.reduce(
        media.find(
          {
            "metadata.owner": Meteor.userId(),
            "metadata.complete": true,
            "metadata.bound": { $ne: true }
          },
          {
            sort: { uploadDate: -1, filename: 1 },
            fields: { filename: 1, md5: 1 }
          }
        ).fetch(),
        (result, medium) => {
          if (! _.has(this.uploads, medium._id)) {
            console.log(medium.filename);
            result[medium._id._str] = {
              _id: medium._id._str,
              progress: 100,
              name: medium.filename
            };
          }
          return result;
        },
        {}
      ),
      currentUser: Meteor.user()
    };
  },
  componentWillMount() {
    const seed = _.get(this, "data.currentUser.settings.patternSeed");
    if (seed) {
      setPattern(seed);
    }
  },
  componentDidMount() {
    media.resumable.assignDrop(document.querySelector("html"));

    media.resumable.on("fileAdded", (file) => {
      this.uploads[file.uniqueIdentifier] = {
        _id: file.uniqueIdentifier,
        name: file.fileName,
        progress: 0
      };
      this.setState({ updateQueue: _.uniqueId() });

      // The file's entrypoint; used to route storage actions.
      let source = file.file.source;
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
        avatarUpload(this, file);
      } else {
        // This is... everything else!
        mediaUpload(this, file, (id) => {
          if (! this.state.mediumId) {
            this.setState({ mediumId: id });
          }
        });
      }
    });

    media.resumable.on("fileProgress", (file) => {
      this.uploads[file.uniqueIdentifier].progress = file.progress() * 100;
      this.setState({ updateQueue: _.uniqueId() });
    });
  },
  createPost(id) {
    this.setState({ mediumId: id });
  },
  deleteMedium(id) {
    Meteor.call("mediumDelete", id);
    if (_.has(this.uploads, id)) {
      delete this.uploads[id];
      this.setState({ updateQueue: _.uniqueId() });
    }
  },
  destroyPostForm() {
    this.setState({ mediumId: null });
  },
  postSuccess() {
    delete this.uploads[this.state.mediumId];
    this.setState({
      mediumId: null,
      updateQueue: _.uniqueId()
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
        open={true}
        onSuccess={this.postSuccess}
        onClose={this.destroyPostForm}
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
  renderQueue() {
    return <UploadQueue
      update={this.state.updateQueue}
      preQueue={this.data.preQueue}
      queue={this.uploads}
      onSelect={this.createPost}
      onDelete={this.deleteMedium}
    />;
  },
  render() {
    return <MuiThemeProvider muiTheme={muiTheme}>
      <div onDrop={this.test}>
        <PseudoBodyContainer
          setColor={this.setColor}
        />
        <header>
          <TopBarComponent color={this.state.color} />
        </header>
        <main>
          {this.props.main}
        </main>
        {this.renderPostForm()}
        {this.renderFooter()}
        {this.renderQueue()}
      </div>
    </MuiThemeProvider>;
  }
});

export default MainLayout;

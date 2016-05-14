import _ from "lodash";
import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import "/imports/api/media/methods";
import media from "/imports/api/media/collection";
import { getMediaUrlMD5 } from "/imports/api/media/urls";
import { eachFile } from "/imports/api/media/eachFile";
import mediaUpload from "/imports/api/media/client/handlers/media";
import avatarUpload from "/imports/api/media/client/handlers/avatar";
import setPattern from "/imports/ui/client/utils/setPattern";
import muiTheme from "/imports/ui/client/utils/muiTheme";
import UploadQueue from "/imports/ui/client/components/UploadQueue";
import PseudoBodyContainer from "/imports/ui/client/components/PseudoBodyContainer";
import TopBar from "/imports/ui/client/components/TopBar/TopBar";
import Dialog from "/imports/ui/client/components/Dialog";
import PostForm from "/imports/ui/client/components/Post/PostForm";
import ResetPassword from "/imports/ui/client/components/User/ResetPassword";

export default React.createClass({
  mixins: [ReactMeteorData],
  uploads: {},
  deleted: [],
  childContextTypes: { currentUser: React.PropTypes.object },
  getChildContext() {
    return { currentUser: this.props.currentUser };
  },
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
            "metadata.bound": { $ne: true },
            "metadata.thumbnailPolicy": { $exists: true }
          },
          {
            sort: { uploadDate: -1, filename: 1 },
            fields: { filename: 1, contentType: 1, md5: 1 }
          }
        ).fetch(),
        (result, medium) => {
          const id = medium._id._str;
          if (! _.has(this.uploads, id) && ! _.includes(this.deleted, id)) {
            result[id] = {
              _id: id,
              progress: 100,
              name: medium.filename,
              type: medium.contentType,
              url: getMediaUrlMD5(medium.md5)
            };
          }
          return result;
        },
        {}
      )
    };
  },
  componentWillMount() {
    const seed = _.get(this, "props.currentUser.settings.patternSeed");
    if (seed) {
      setPattern(seed);
    }
  },
  navWarning() {
    return "You have uploads in progress!";
  },
  componentDidMount() {
    // Binding drop here prevents handleDrop from working, so we don't bind drop here.
    //media.resumable.assignDrop(document.querySelector("html"));

    media.resumable.on("fileAdded", (file) => {
      window.onbeforeunload = this.navWarning;

      this.uploads[file.uniqueIdentifier] = {
        _id: file.uniqueIdentifier,
        name: file.fileName,
        type: file.file.type,
        progress: 0
      };

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.uploads[file.uniqueIdentifier].url = reader.result;
        this.setState({ updateQueue: _.uniqueId() });
      }, false);
      reader.readAsDataURL(file.file);

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
        avatarUpload(file, (id) => {
          delete this.uploads[id];
          if (_.isEmpty(this.uploads)) {
            window.onbeforeunload = null;
          }
          this.setState({ updateQueue: _.uniqueId() });
        });
      } else {
        // This is... everything else!
        mediaUpload(file, (id) => {
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
  preventDefault(e) {
    e.preventDefault();
  },
  handleDrop(e) {
    e.preventDefault();
    eachFile(e, (file) => {
      file.source = "media";
      media.resumable.addFile(file);
    });
    const url = $(e.dataTransfer.getData("text/html")).filter("img").attr("src");
    if (url) {
      console.log(url);
      const img = new Image();
      const canvas = document.createElement("canvas");
      img.onload = function(e) {
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
        canvas.toBlob((blob) => {
          const ext = blob.type.split("/")[1];
          const fileName = _.first(_.last(url.split("/")).split("."));
          blob.name = fileName + "." + ext;
          blob.source = "media";
          media.resumable.addFile(blob);
        });
      };
      img.crossOrigin = "";
      img.src = url;
    }
  },
  handlePaste(e) {
    _.each(e.clipboardData.items, (item) => {
      if (item.kind === "file") {
        const blob = item.getAsFile();
        const ext = item.type.split("/")[1];
        blob.name = "pasted." + ext;
        blob.source = "media";
        media.resumable.addFile(blob);
      }
    });
  },
  createPost(id) {
    this.setState({ mediumId: id });
  },
  deleteMedium(id) {
    this.deleted.push(id);
    if (_.has(this.uploads, id)) {
      delete this.uploads[id];
      if (_.isEmpty(this.uploads)) {
        window.onbeforeunload = null;
      }
    }
    Meteor.call("mediumDelete", id);
    this.setState({ updateQueue: _.uniqueId() });
  },
  destroyPostForm() {
    this.setState({ mediumId: null });
  },
  postSuccess(mediumId) {
    delete this.uploads[mediumId];
    if (_.isEmpty(this.uploads)) {
      window.onbeforeunload = null;
    }
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
      return <Dialog
        title="Create Post"
        formId="formNewPost"
        open={true}
        onClose={this.destroyPostForm}
      >
        <PostForm
          id="formNewPost"
          mediumId={this.state.mediumId}
          onSuccess={this.postSuccess}
          onClose={this.destroyPostForm}
        />
      </Dialog>;
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
    if (! _.isEmpty(this.uploads) || ! _.isEmpty(this.data.preQueue)) {
      return <UploadQueue
        update={this.state.updateQueue}
        preQueue={this.data.preQueue}
        queue={this.uploads}
        onSelect={this.createPost}
        onDelete={this.deleteMedium}
      />;
    }
  },
  renderMain() {
    if (this.props.passwordResetToken) {
      return <ResetPassword
        passwordResetToken={this.props.passwordResetToken}
        doneCallback={this.props.doneCallback}
      />;
    }
    return this.props.main;
  },
  render() {
    return <MuiThemeProvider muiTheme={muiTheme}>
      <div onDragOver={this.preventDefault} onDrop={this.handleDrop} onPaste={this.handlePaste}>
        <PseudoBodyContainer
          setColor={this.setColor}
        />
        <header>
          <TopBar color={this.state.color} />
        </header>
        <main>
          {this.renderMain()}
        </main>
        {this.renderPostForm()}
        {this.renderFooter()}
        {this.renderQueue()}
      </div>
    </MuiThemeProvider>;
  }
});

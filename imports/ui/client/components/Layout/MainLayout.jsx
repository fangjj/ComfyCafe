import _ from "lodash";
import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import "/imports/api/media/methods";
import media from "/imports/api/media/collection";
import mediaUpload from "/imports/api/media/client/handlers/media";
import avatarUpload from "/imports/api/media/client/handlers/avatar";

import setPattern from "/imports/ui/client/utils/setPattern";
import muiTheme from "/imports/ui/client/utils/muiTheme";
import UploadQueue from "/imports/ui/client/components/UploadQueue";
import PseudoBodyContainer from "/imports/ui/client/components/PseudoBodyContainer";
import TopBar from "/imports/ui/client/components/TopBar/TopBar";
import Dialog from "/imports/ui/client/components/Dialog";
import PostForm from "/imports/ui/client/components/Post/PostForm";

export default React.createClass({
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
            fields: { filename: 1, contentType: 1, md5: 1 }
          }
        ).fetch(),
        (result, medium) => {
          const id = medium._id._str;
          if (! _.has(this.uploads, id)) {
            result[id] = {
              _id: id,
              progress: 100,
              name: medium.filename,
              type: medium.contentType,
              url: "/gridfs/media/" + medium.md5
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
  render() {
    return <MuiThemeProvider muiTheme={muiTheme}>
      <div onPaste={this.handlePaste}>
        <PseudoBodyContainer
          setColor={this.setColor}
        />
        <header>
          <TopBar color={this.state.color} />
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

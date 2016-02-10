mediaUpload = function (self, file) {
  self.setState({isUploading: true});
  media.insert({
      _id: file.uniqueIdentifier,
      filename: file.fileName,
      contentType: file.file.type,
      metadata: {
        thumbnailPolicy: "postMedium"
      }
    }, function (err, _id) {
      if (err) { return console.error("File creation failed!", err); }
      media.resumable.upload();

      var cursor = media.find({ _id: _id });
      var liveQuery = cursor.observe({
        changed: function(newImage, oldImage) {
          if (newImage.length === file.size) {
            liveQuery.stop();
            self.setState({
              isUploading: false,
              progress: 0
            });
            Meteor.call("addPost", {
              mediumId: file.uniqueIdentifier,
              tags: "tagme"
            }, function (err, name) {
              var path = FlowRouter.path("post", {
                username: Meteor.user().username,
                postName: name
              });
              FlowRouter.go(path);
            });
          }
        }
      });
    }
  );
};

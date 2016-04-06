import media from "../collection";
import "../methods";

export default function (self, file, callback) {
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
            var done = function () {
              liveQuery.stop();
              self.setState({
                isUploading: false,
                progress: 0
              });
              callback(file.uniqueIdentifier);
            };

            if (newImage.contentType.split("/")[0] === "image") {
              var img = new Image();
              img.onload = function () {
                var imgWidth = this.width;
                var imgHeight = this.height;
                URL.revokeObjectURL(img.src);

                Meteor.call("mediumDimensions", file.uniqueIdentifier, imgWidth, imgHeight);
                Meteor.call("mediumColor", file.uniqueIdentifier);

                done();
              }
              img.src = URL.createObjectURL(file.file);
            } else {
              done();
            }
          }
        }
      });
    }
  );
};
